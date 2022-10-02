import {
  mergeDefaultYTSearchOptions,
  YTSearchOptions,
} from './YTMusicSearchOptions';
import puppeteer from 'puppeteer';

const YOUTUBE_MUSIC_URL = 'https://music.youtube.com/';

export class YTMusicSession {
  private constructor(private page) {}

  static async create(args?: string[]) {
    const browser = await puppeteer.launch({
      headless: true,
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
    mergeDefaultYTSearchOptions(ytSearchOptions);

    let url = `${YOUTUBE_MUSIC_URL}search?q=${args.join('+')}`;
    await this.page.goto(url);

    const searchResultsSelector =
      'ytmusic-shelf-renderer:first-of-type div#contents';

    //Wait for search results to load
    await this.page.waitForSelector(searchResultsSelector);

    await this.page.click(searchResultsSelector);
  }

  public async nextSong() {
    const nextSongSelector = `tp-yt-paper-icon-button[title="Next song"]`;
    await this.page.waitForSelector(nextSongSelector);
    await this.page.click(nextSongSelector);
  }

  public async skipAds() {
    const skipAdsSelector = `#skip-button:5`;
    await this.page.waitForSelector(skipAdsSelector);
    await this.page.click(skipAdsSelector);
  }
}
