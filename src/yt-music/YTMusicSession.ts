import {
  mergeDefaultYTSearchOptions,
  YTSearchOptions,
} from './YTMusicSearchOptions';
import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import Adblocker from 'puppeteer-extra-plugin-adblocker';
import {
  mergeDefaultYTSessionOptions,
  YTSessionOptions,
} from './YTSessionOptions';
import { YTPlayUpdates } from './YTPlayUpdates';

const YOUTUBE_MUSIC_URL = 'https://music.youtube.com/';

export class YTMusicSession {
  public PlayUpdates: YTPlayUpdates;

  private constructor(private page: Page) {
    this.PlayUpdates = new YTPlayUpdates(page, [(song) => console.log(song)]);
  }

  static async create(
    args?: string[],
    sessionOptions?: Partial<YTSessionOptions>
  ) {
    sessionOptions = mergeDefaultYTSessionOptions(sessionOptions);

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

  public async search(
    args: string[],
    ytSearchOptions?: Partial<YTSearchOptions>
  ) {
    ytSearchOptions = mergeDefaultYTSearchOptions(ytSearchOptions);

    let url = `${YOUTUBE_MUSIC_URL}search?q=${args.join('+')}`;
    await this.page.goto(url);

    const searchResultsSelector =
      'ytmusic-shelf-renderer:first-of-type div#contents';

    //Wait for search results to load
    await this.page.waitForSelector(searchResultsSelector);

    if (!ytSearchOptions.activateFirstResult) return;

    await Promise.all([
      this.page.click(searchResultsSelector),
      this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    await this.PlayUpdates.forceSongUpdate();
  }

  public async nextSong() {
    const nextSongSelector = `tp-yt-paper-icon-button[title="Next song"]`;
    await this.page.waitForSelector(nextSongSelector);
    await this.page.click(nextSongSelector);
  }

  public async previousSong() {
    const previousSongSelector = `tp-yt-paper-icon-button[title="Previous song"]`;
    await this.page.waitForSelector(previousSongSelector);
    await this.page.click(previousSongSelector);
  }

  public async playPause() {
    const playPauseSelector = `#play-pause-button`;
    await this.page.waitForSelector(playPauseSelector);
    await this.page.click(playPauseSelector);
  }
}
