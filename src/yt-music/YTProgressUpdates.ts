import { Page } from 'puppeteer';
import { Progress, ProgressUpdate, ProgressUpdateSubscriber } from '../progress-bar/ProgressUpdate';

// This is pretty much the same as YTPlayUpdates

export class YTProgressUpdates implements ProgressUpdate {
  private subscribers: ProgressUpdateSubscriber[];

  private progress: Progress;

  public get currentProgress() {
    return this.progress;
  }

  constructor(private page: Page, initialSubscribers?: ProgressUpdateSubscriber[]) {
    this.subscribers = initialSubscribers || [];
    this.handleProgressUpdate();
  }
  

  public subscribe = (callback: ProgressUpdateSubscriber) => {
    this.subscribers.push(callback);
  };

  public async forceProgressUpdate() {
    
    await this.page.waitForSelector(`video`);

    const progress = await this.page.$eval(
        `video`,
        (element: HTMLVideoElement) => {
          return { 
            currentTime: element.currentTime, 
            currentDuration: element.duration, 
          }
        }
      );

    this.progress = progress;

    this.subscribers.forEach((subscriber) => subscriber(this.progress));
  }

  private async handleProgressUpdate() {
    await this.page.exposeFunction(
      'handleProgressUpdate',
      (currentProgress: Progress) => {
        this.progress = currentProgress;
        this.subscribers.forEach((subscriber) => subscriber(this.progress));
      }
    );

    await this.page.waitForSelector(`video`);

    await this.page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const currentVideoElement: HTMLVideoElement = document.querySelector(`video`);

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
