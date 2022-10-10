import { Page } from 'puppeteer';
import { VolumeControl } from '../user-controls/VolumeControl';

export class YTMusicVolumeControl implements VolumeControl {
  private volume = 1;

  constructor(private page: Page) {
    this.getInitialVolume();
    this.handleVideoUpdate();
  }

  private async getInitialVolume() {
    await this.page.waitForSelector('video');
    this.volume = await this.page.$eval('video', (el: HTMLVideoElement) => {
      return el.volume;
    });
  }

  /**
   * The current volume of the music as a value from 0 to 1.
   */
  public get currentVolume() {
    return this.volume;
  }

  /**
   * Updates the volume of the music.
   * @param volume A value between 0 and 1 (0% to 100% volume) to which to set the music volume.
   */
  public async setVolume(volume: number) {
    if (volume < 0 || volume > 1) return;
    await this.page.$eval(
      'video',
      (el: HTMLVideoElement, volume) => {
        el.volume = volume;
      },
      volume
    );
    this.volume = volume;
  }

  private async handleVideoUpdate() {
    //YT has internal functions that reset the volume of the video element after it changes - sometime around 200ms later.
    //This setup listens for video src changes and makes multiple attempts to keep the volume where it should be.
    //Feels a little janky, but it works.
    await this.page.exposeFunction('handleVideoUpdate', () => {
      let count = 0;
      const intervalID = setInterval(() => {
        if (count++ < 15) this.setVolume(this.volume);
        else clearInterval(intervalID);
      }, 25);
    });
    await this.page.waitForSelector(`video`);
    await this.page.evaluate(() => {
      const videoObserver = new MutationObserver(() => {
        //@ts-ignore
        handleVideoUpdate();
      });
      videoObserver.observe(document.querySelector(`video`), {
        attributes: true,
        attributeFilter: ['src'],
      });
    });
  }
}
