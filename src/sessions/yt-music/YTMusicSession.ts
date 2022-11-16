import { BrowserSession } from '../base/BrowserSession';
import { Page, executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import Adblocker from 'puppeteer-extra-plugin-adblocker';
import {
  mergeDefaultSessionOptions,
  SessionOptions,
} from '../base/SessionOptions';
import { YTPlayUpdates } from './YTPlayUpdates';
import { YTMusicPlaybackControls } from './YTMusicPlaybackControls';
import { YTProgressUpdates } from './YTProgressUpdates';
import { YTSearchHandler } from './YTSearchHandler';
import { YTMusicVolumeControl } from './YTMusicVolumeControl';

const YOUTUBE_MUSIC_URL = 'https://music.youtube.com/';

/**
 * A YTMusicSession instance manages all headless browsing of the Youtube Music website. A YTMusicSession must be instantiated asynchronously via the 'create' function.
 * @param page An initialized Puppeteer page used to navigate Youtube music.
 */
export class YTMusicSession extends BrowserSession {
  private playUpdates: YTPlayUpdates;
  private progressUpdates: YTProgressUpdates;
  private searchHandler: YTSearchHandler;
  private playbackControls: YTMusicPlaybackControls;
  private volumeControl: YTMusicVolumeControl;

  protected constructor(private page: Page) {
    super();
    this.playUpdates = new YTPlayUpdates(
      this.page,
      (value) => (this.currentSong = value)
    );
    this.searchHandler = new YTSearchHandler(
      this.page,
      (value) => (this.searchResults = value)
    );
    this.progressUpdates = new YTProgressUpdates(
      this.page,
      (value) => (this.currentTime = value)
    );
    this.volumeControl = new YTMusicVolumeControl(this.page);
    this.playbackControls = new YTMusicPlaybackControls(this.page);
  }

  private static startAttempts = 0;

  /**
   * Asynchronously creates an instance of a YTMusicSession. A YTMusicSession instance manages all headless browsing of the Youtube Music website.
   * @param sessionOptions Options for the session, to include any search arguments.
   * @returns An instance of a YTMusicSession.
   */
  public static async create(sessionOptions?: Partial<SessionOptions>) {
    sessionOptions = mergeDefaultSessionOptions(sessionOptions);

    puppeteer.use(Adblocker({ blockTrackers: true }));
    let page: Page;

    try {
      const browser = await puppeteer.launch({
        headless: sessionOptions.headless,
        ignoreDefaultArgs: ['--mute-audio'],
        args: ['--autoplay-policy=no-user-gesture-required'],
        executablePath: executablePath(),
      });
      page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
      );
    } catch (error) {
      console.log('Error while initializing Puppeteer instance.');
      console.error(error);

      if (YTMusicSession.startAttempts >= 3) {
        console.log('Failed to initialize Puppeteer session. Exiting...');
        process.exit();
      }

      console.log('Attempting to restart...');

      await new Promise((res) => setTimeout(res, 3000));

      YTMusicSession.startAttempts++;
      const session = await YTMusicSession.create(sessionOptions);
      return session;
    }

    const session = new YTMusicSession(page);

    await session.initialSearch(sessionOptions.args);
    return session;
  }

  /**
   * Initiates a search of Youtube Music based on the args passed in.
   * @param args A list of strings that will be concatenated with a '+' in the search URL
   * @param ytSearchOptions Additional options for the search.
   */
  private async initialSearch(args: string[]) {
    if (!args.length) {
      await this.page.goto(YOUTUBE_MUSIC_URL, {
        waitUntil: 'networkidle2',
      });
      return;
    }

    let url = `${YOUTUBE_MUSIC_URL}search?q=${args.join('+')}`;
    try {
      await this.page.goto(url, {
        waitUntil: 'networkidle2',
      });

      const songResultsSelector = 'a[title="Show song results"]';

      // Make sure we get only songs. Give up after four seconds.
      await this.page.waitForSelector(songResultsSelector, {
        timeout: 4000,
      });

      await Promise.all([
        this.page.click(songResultsSelector),
        this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);

      const searchResultsSelector =
        'ytmusic-shelf-renderer:first-of-type div#contents ytmusic-responsive-list-item-renderer #play-button';

      //Wait for search results to load
      await this.page.waitForSelector(searchResultsSelector);

      await Promise.all([
        this.page.click(searchResultsSelector),
        this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);
    } catch (error) {
      console.log('Error while navigating to initial search argument.');
      console.error(error);

      await this.page.goto(YOUTUBE_MUSIC_URL, {
        waitUntil: 'networkidle2',
      });
    }

    await this.playUpdates.forceSongUpdate();
  }

  /**
   * Get or set the current music volume.
   */
  public get volume() {
    return this.volumeControl.currentVolume;
  }

  public set volume(value: number) {
    if (!this.currentSong) return;
    this.volumeControl.setVolume(value);
  }

  /**
   * Provides playback control to pause, play, or change the current song. Options are 'playPause', 'next', and 'previous'.
   */
  public controls = {
    playPause: () => {
      if (!this.currentSong) return;
      this.playbackControls.playPause();
    },
    next: () => {
      if (!this.currentSong) return;
      this.playbackControls.next();
    },
    previous: () => {
      if (!this.currentSong) return;
      this.playbackControls.previous();
    },
  };

  /**
   * Execute a search for a specified query. The searchResults property will be populated once the search is completed.
   * @param query
   */
  public async search(query: string): Promise<void> {
    await this.searchHandler.search(query);
  }

  /**
   * Select a song by its playID from a the list of searchResults, and play it.
   * @param playID
   */
  public async select(playID: string): Promise<void> {
    await this.searchHandler.play(playID);
    await this.playUpdates.forceSongUpdate();
  }

  /**
   * Closes the browser and ends the session.
   */
  public async close() {
    await this.page.browser().close();
  }
}
