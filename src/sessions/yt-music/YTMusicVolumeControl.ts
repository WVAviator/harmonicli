import { Page } from 'puppeteer';
import { VolumeControl } from '../base/VolumeControl';

export class YTMusicVolumeControl implements VolumeControl {
  private volume = 1;

  constructor(private page: Page) {
    this.getInitialVolume();
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
    await this.page.evaluate(
      (volume: number) => {
        const volumeSlider: HTMLInputElement = document.querySelector('#volume-slider');
        volumeSlider.value = Math.floor(volume * 100).toString();
        volumeSlider.dispatchEvent(new Event('change'));
      },
      volume
    );
    this.volume = volume;
  }
}
