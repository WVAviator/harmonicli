import crypto from 'crypto';
import { Page } from 'puppeteer';

// This is pretty much the same as YTPlayUpdates

export class YTProgressUpdates {
  private _currentTime: number;

  /**
   * Manages the progress of the song playing in the current YTMusicSession instance.
   * @param {Page} page
   * @param {(value: number) => void} setCurrentTime A callback to be invoked when currentTime updates
   */
  constructor(
    private page: Page,
    private setCurrentTime: (value: number) => void
  ) {
    this.handleProgressUpdate();
    this.forceProgressUpdate();
  }

  /**
   * Gets the progress of the current song as an object with currentTime and currentDuration properties.
   */
  public get currentTime() {
    return this._currentTime;
  }

  private set currentTime(value: number) {
    this._currentTime = value;
    this.setCurrentTime(value);
  }

  /**
   * Force a lookup of the current song progress. Useful when the DOM first loads before a MutationObserver can be set up.
   */
  public async forceProgressUpdate() {
    await this.page.waitForSelector(`video`);

    const updatedTime = await this.page.$eval(
      `video`,
      (element: HTMLVideoElement) => element.currentTime
    );

    this.currentTime = updatedTime;
  }

  private async handleProgressUpdate() {
    await this.page.exposeFunction(
      'handleTimeUpdate',
      (updatedTime: number) => {
        this.currentTime = updatedTime;
      }
    );

    await this.page.waitForSelector(`video`);

    await this.page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const videoElement: HTMLVideoElement = document.querySelector(`video`);

        //@ts-ignore
        handleTimeUpdate(videoElement.currentTime);
      });

      observer.observe(document.querySelector('#progress-bar'), {
        attributes: true,
      });
    });
  }
}
