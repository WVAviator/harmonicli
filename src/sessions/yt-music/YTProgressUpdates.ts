import crypto from 'crypto';
import { Page } from 'puppeteer';
import {
  Progress,
  ProgressUpdate,
  ProgressUpdateSubscriber,
} from '../base/ProgressUpdate';

// This is pretty much the same as YTPlayUpdates

export class YTProgressUpdates implements ProgressUpdate {
  private subscribers: Record<string, ProgressUpdateSubscriber> = {};

  private progress: Progress;

  /**
   * Gets the progress of the current song as an object with currentTime and currentDuration properties.
   */
  public get currentProgress() {
    return this.progress;
  }

  /**
   * Manages the progress of the song playing in the current YTMusicSession instance.
   * @param {Page} page
   * @param {ProgressUpdateSubscriber[]} initialSubscribers
   */
  constructor(
    private page: Page,
    initialSubscribers?: ProgressUpdateSubscriber[]
  ) {
    if (initialSubscribers)
      initialSubscribers.forEach((sub) => this.subscribe(sub));
    this.handleProgressUpdate();
  }

  /**
   * Add a callback function to the list of subscribers to be invoked when the song progress updates.
   * @param {ProgressUpdateSubscriber} callback
   * @returns A string ID representing the current subscribers.
   */
  public subscribe = (callback: ProgressUpdateSubscriber) => {
    const subscriberId = crypto.randomBytes(8).toString('hex');
    this.subscribers[subscriberId] = callback;
    return subscriberId;
  };

  /**
   * Removes a callback function from the list of subscribers.
   * @param {string} subscriberId
   */
  public unsubscribe = (subscriberId: string) => {
    delete this.subscribers[subscriberId];
  };

  /**
   * Force a lookup of the current song progress. Useful when the DOM first loads before a MutationObserver can be set up.
   */
  public async forceProgressUpdate() {
    await this.page.waitForSelector(`video`);

    const progress = await this.page.$eval(
      `video`,
      (element: HTMLVideoElement) => {
        return {
          currentTime: element.currentTime,
          currentDuration: element.duration,
        };
      }
    );

    this.progress = progress;

    Object.values(this.subscribers).forEach((subscriber) =>
      subscriber(this.progress)
    );
  }

  private async handleProgressUpdate() {
    await this.page.exposeFunction(
      'handleProgressUpdate',
      (currentProgress: Progress) => {
        this.progress = currentProgress;
        Object.values(this.subscribers).forEach((subscriber) =>
          subscriber(this.progress)
        );
      }
    );

    await this.page.waitForSelector(`video`);

    await this.page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const currentVideoElement: HTMLVideoElement =
          document.querySelector(`video`);

        const currentProgress: Progress = {
          currentTime: currentVideoElement.currentTime,
          currentDuration: currentVideoElement.duration,
        };

        //@ts-ignore
        handleProgressUpdate(currentProgress);
      });

      observer.observe(document.querySelector('#progress-bar'), {
        attributes: true,
      });
    });
  }
}
