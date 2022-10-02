import { Page } from 'puppeteer';

type PlayUpdateSubscriber = (nowPlaying: string) => void;

export class YTPlayUpdates {
  private subscribers: PlayUpdateSubscriber[] = [];

  private currentSong: string = '';
  private currentArtist: string = '';

  public get nowPlaying() {
    return `${this.currentSong} | ${this.currentArtist}`;
  }

  constructor(private page: Page, initialSubscribers?: PlayUpdateSubscriber[]) {
    this.subscribers = initialSubscribers;
    this.handlePlayUpdate();
  }

  public subscribe = (callback: PlayUpdateSubscriber) => {
    this.subscribers.push(callback);
  };

  public async forceSongUpdate() {
    await Promise.all([
      this.page.waitForSelector(`ytmusic-player-bar yt-formatted-string`),
      this.page.waitForSelector(
        `ytmusic-player-bar span.subtitle yt-formatted-string a`
      ),
    ]);

    const [currentSong, currentArtist] = await Promise.all([
      this.page.$eval(
        `ytmusic-player-bar yt-formatted-string`,
        (element: HTMLElement) => element.innerText
      ),
      this.page.$eval(
        `ytmusic-player-bar span.subtitle yt-formatted-string a`,
        (element: HTMLElement) => element.innerText
      ),
    ]);

    this.currentSong = currentSong;
    this.currentArtist = currentArtist;

    this.subscribers.forEach((subscriber) => subscriber(this.nowPlaying));
  }

  private async handlePlayUpdate() {
    await this.page.exposeFunction(
      'handlePlayUpdate',
      (newSongInfo: string, newArtistInfo: string) => {
        this.currentSong = newSongInfo;
        this.currentArtist = newArtistInfo;
        this.subscribers.forEach((subscriber) => subscriber(this.nowPlaying));
      }
    );
    await Promise.all([
      this.page.waitForSelector(`ytmusic-player-bar yt-formatted-string`),
      this.page.waitForSelector(
        `ytmusic-player-bar span.subtitle yt-formatted-string a`
      ),
    ]);

    await this.page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const newSongElement: HTMLElement = document.querySelector(
          `ytmusic-player-bar yt-formatted-string`
        );
        const newArtistElement: HTMLElement = document.querySelector(
          `ytmusic-player-bar span.subtitle yt-formatted-string a`
        );

        //@ts-ignore
        handlePlayUpdate(newSongElement.innerText, newArtistElement.innerText);
      });
      observer.observe(
        document.querySelector(`ytmusic-player-bar yt-formatted-string`),
        {
          attributes: false,
          childList: true,
          subtree: true,
        }
      );
    });
  }
}
