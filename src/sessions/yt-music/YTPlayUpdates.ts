import { Page } from 'puppeteer';
import { Song } from '../base/BrowserSession';

export class YTPlayUpdates {
  private _currentSong: Song;

  /**
   * Manages the currently playing song of a YTMusicSession instance. Updates to the current song can be subscribed to and can be force-updated if needed.
   * @param {Page} page The Puppeteer page instance of the YTMusicSession.
   * @param {(value: Song) => void} setCurrentSong A callback that will be invoked when the current song updates.
   */
  constructor(
    private page: Page,
    private setCurrentSong: (value: Song) => void
  ) {
    this.handlePlayUpdate();
    this.forceSongUpdate();
  }

  public get currentSong(): Song {
    return this._currentSong;
  }

  private set currentSong(value: Song) {
    this._currentSong = value;
    this.setCurrentSong(value);
  }

  /**
   * Forces an update to the current song. This is useful when the page first loads as the subscribers will automatically receive updates when the DOM changes but not when it is first initialized.
   */
  public async forceSongUpdate() {
    await Promise.all([
      this.page.waitForSelector(`ytmusic-player-bar yt-formatted-string`),
      this.page.waitForSelector(
        `ytmusic-player-bar span.subtitle yt-formatted-string a`
      ),
      this.page.waitForSelector(`video`),
    ]);

    const [currentSong, currentArtist, currentDuration] = await Promise.all([
      this.page.$eval(
        `ytmusic-player-bar yt-formatted-string`,
        (element: HTMLElement) => element.innerText
      ),
      this.page.$eval(
        `ytmusic-player-bar span.subtitle yt-formatted-string a`,
        (element: HTMLElement) => element.innerText
      ),
      this.page.$eval(`video`, (element: HTMLVideoElement) => element.duration),
    ]);

    this.currentSong = {
      song: currentSong,
      artist: currentArtist,
      duration: currentDuration,
    };
  }

  private async handlePlayUpdate() {
    await this.page.exposeFunction(
      'handlePlayUpdate',
      (newSong: string, newArtist: string, newDuration: number) => {
        this.currentSong = {
          song: newSong,
          artist: newArtist,
          duration: newDuration,
        };
      }
    );
    await Promise.all([
      this.page.waitForSelector(`ytmusic-player-bar yt-formatted-string`),
      this.page.waitForSelector(
        `ytmusic-player-bar span.subtitle yt-formatted-string a`
      ),
      this.page.waitForSelector(`video`),
    ]);

    await this.page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const newSongElement: HTMLElement = document.querySelector(
          `ytmusic-player-bar yt-formatted-string`
        );
        const newArtistElement: HTMLElement = document.querySelector(
          `ytmusic-player-bar span.subtitle yt-formatted-string a`
        );
        const videoElement: HTMLVideoElement = document.querySelector(`video`);

        //@ts-ignore
        handlePlayUpdate(
          newSongElement.innerText,
          newArtistElement.innerText,
          videoElement.duration
        );
      });
      observer.observe(document.querySelector(`video`), {
        attributes: true,
        attributeFilter: ['src'],
      });
    });
  }
}
