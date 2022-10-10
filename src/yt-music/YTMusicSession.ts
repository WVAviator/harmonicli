import { BrowserSession } from './../user-controls/BrowserSession';
import {
  mergeDefaultYTSearchOptions,
  YTSearchOptions,
} from './YTMusicSearchOptions';
import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import Adblocker from 'puppeteer-extra-plugin-adblocker';
import {
  mergeDefaultSessionOptions,
  SessionOptions,
} from '../user-controls/SessionOptions';
import { YTPlayUpdates } from './YTPlayUpdates';
import { YTMusicPlaybackControls } from './YTMusicPlaybackControls';
import { YTProgressUpdates } from './YTProgressUpdates';
import { YTSearchHandler } from './YTSearchHandler';
import { YTMusicVolumeControl } from './YTMusicVolumeControl';

const YOUTUBE_MUSIC_URL = 'https://music.youtube.com/';

export class YTMusicSession implements BrowserSession {
  public PlayUpdates: YTPlayUpdates;
  public ProgressUpdates: YTProgressUpdates;
  public SearchHandler: YTSearchHandler;
  public PlaybackControls: YTMusicPlaybackControls;
  public VolumeControl: YTMusicVolumeControl;

  /**
   * A YTMusicSession instance manages all headless browsing of the Youtube Music website. A YTMusicSession must be instantiated asynchronously via the 'create' function.
   * @param page An initialized Puppeteer page used to navigate Youtube music.
   */
  private constructor(private page: Page) {
    this.PlayUpdates = new YTPlayUpdates(page);
    this.ProgressUpdates = new YTProgressUpdates(page);
    this.SearchHandler = new YTSearchHandler(page);
    this.PlaybackControls = new YTMusicPlaybackControls(page);
    this.VolumeControl = new YTMusicVolumeControl(page);
  }

  /**
   * Asynchronously creates an instance of a YTMusicSession. A YTMusicSession instance manages all headless browsing of the Youtube Music website.
   * @param args Any search query arguments entered by the user. These will automatically initiate a search.
   * @param sessionOptions Any additional options for the session.
   * @returns An instance of a YTMusicSession.
   */
  static async create(
    args?: string[],
    sessionOptions?: Partial<SessionOptions>
  ) {
    sessionOptions = mergeDefaultSessionOptions(sessionOptions);

    puppeteer.use(Adblocker({ blockTrackers: true }));
    const browser = await puppeteer.launch({
      headless: sessionOptions.headless,
      ignoreDefaultArgs: ['--mute-audio'],
      args: ['--autoplay-policy=no-user-gesture-required'],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    );

    const session = new YTMusicSession(page);
    if (args) {
      await session.search(args);
    }
    return session;
  }

  /**
   * Initiates a search of Youtube Music based on the args passed in.
   * @param args A list of strings that will be concatenated with a '+' in the search URL
   * @param ytSearchOptions Additional options for the search.
   */
  public async search(
    args: string[],
    ytSearchOptions?: Partial<YTSearchOptions>
  ) {
    ytSearchOptions = mergeDefaultYTSearchOptions(ytSearchOptions);

    let url = `${YOUTUBE_MUSIC_URL}search?q=${args.join('+')}`;
    await this.page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const searchResultsSelector =
      'ytmusic-shelf-renderer:first-of-type div#contents ytmusic-responsive-list-item-renderer #play-button';

    //Wait for search results to load
    await this.page.waitForSelector(searchResultsSelector);

    if (!ytSearchOptions.activateFirstResult) return;

    await Promise.all([
      this.page.click(searchResultsSelector),
      this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    await this.PlayUpdates.forceSongUpdate();
  }

  public async close() {
    await this.page.browser().close();
  }
}
