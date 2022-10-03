import { Page } from 'puppeteer';
import {
  PlayUpdates,
  PlayUpdateSubscriber,
} from '../user-controls/PlayUpdates';

export class YTPlayUpdates implements PlayUpdates {
  private subscribers: PlayUpdateSubscriber[];

  private currentSong: string;
  private currentArtist: string;

  /**
   * A formatted display string that indicates the current song and artist that is playing.
   */
  public get nowPlaying() {
    return `${this.currentSong} | ${this.currentArtist}`;
  }

  /**
   * Manages the currently playing song of a YTMusicSession instance. Updates to the current song can be subscribed to and can be force-updated if needed.
   * @param page The Puppeteer page instance of the YTMusicSession.
   * @param initialSubscribers A list of subscribers that will be subscribed before any play updates.
   */
  constructor(private page: Page, initialSubscribers?: PlayUpdateSubscriber[]) {
    this.subscribers = initialSubscribers || [];
    this.handlePlayUpdate();
  }

  /**
   * Subscribes to automatic updates of either the current song or current artist.
   * @param callback A callback that will be invoked when the current song or artist changes. The callback may receive one argument - a formatted string indicating the new song and artist.
   */
  public subscribe = (callback: PlayUpdateSubscriber) => {
    this.subscribers.push(callback);
  };

  /**
   * Forces an update to the current song. This is useful when the page first loads as the subscribers will automatically receive updates when the DOM changes but not when it is first initialized.
   */
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
