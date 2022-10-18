import { BrowserSession, Song } from '../base/BrowserSession';
import { Page } from 'puppeteer';
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
  public async search(query: string): Promise<void> {
    await this.searchHandler.search(query);
  }
  public async select(playID: string): Promise<void> {
    await this.searchHandler.play(playID);
  }
  public controls: {
    playPause: () => void;
    next: () => void;
    previous: () => void;
  };

  private playUpdates: YTPlayUpdates;
  public ProgressUpdates: YTProgressUpdates;
  private searchHandler: YTSearchHandler;
  public PlaybackControls: YTMusicPlaybackControls;
  public VolumeControl: YTMusicVolumeControl;

  private page: Page;

  /**
   * Asynchronously creates an instance of a YTMusicSession. A YTMusicSession instance manages all headless browsing of the Youtube Music website.
   * @param args Any search query arguments entered by the user. These will automatically initiate a search.
   * @param sessionOptions Any additional options for the session.
   * @returns An instance of a YTMusicSession.
   */
  protected async initialize(sessionOptions?: Partial<SessionOptions>) {
    sessionOptions = mergeDefaultSessionOptions(sessionOptions);

    puppeteer.use(Adblocker({ blockTrackers: true }));
    const browser = await puppeteer.launch({
      headless: sessionOptions.headless,
      ignoreDefaultArgs: ['--mute-audio'],
      args: ['--autoplay-policy=no-user-gesture-required'],
    });
    this.page = await browser.newPage();
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    );

    await this.initialSearch(sessionOptions.args);

    this.playUpdates = new YTPlayUpdates(
      this.page,
      (value) => (this.currentSong = value)
    );
    this.searchHandler = new YTSearchHandler(
      this.page,
      (value) => (this.searchResults = value)
    );
  }

  /**
   * Initiates a search of Youtube Music based on the args passed in.
   * @param args A list of strings that will be concatenated with a '+' in the search URL
   * @param ytSearchOptions Additional options for the search.
   */
  private async initialSearch(args: string[]) {
    let url = YOUTUBE_MUSIC_URL;
    if (args.length) url += `search?q=${args.join('+')}`;
    await this.page.goto(url, {
      waitUntil: 'networkidle2',
    });

    // Make sure we get only songs.
    await this.page.click('a[title="Show song results"]').catch((_) => {
      /**
       * The below should only run if there are no results.
       * If there are any issues we'll have to switch to the try/catch method to be more explicit.
       */
      console.log('No results found.');
      process.exit(0);
    });

    const searchResultsSelector =
      'ytmusic-shelf-renderer:first-of-type div#contents ytmusic-responsive-list-item-renderer #play-button';

    //Wait for search results to load
    await this.page.waitForSelector(searchResultsSelector);

    await Promise.all([
      this.page.click(searchResultsSelector),
      this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    await this.playUpdates.forceSongUpdate();
  }

  /**
   * Closes the browser and ends the session.
   */
  public async close() {
    await this.page.browser().close();
  }
}
