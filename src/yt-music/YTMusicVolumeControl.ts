import { Page } from 'puppeteer';
import { VolumeControl } from '../user-controls/VolumeControl';

export class YTMusicVolumeControl implements VolumeControl {
  private volume = 1;

  constructor(private page: Page) {
    this.setInitialVolume();
  }

  private async setInitialVolume() {
    await this.page.waitForSelector('#volume-slider');
    this.volume = await this.page.$eval('#volume-slider', (el) => {
      const maxVolume = +el.getAttribute('max');
      const currentVolume = +el.getAttribute('value');
      return currentVolume / maxVolume;
    });
  }

  public get currentVolume() {
    return this.volume;
  }

  async setVolume(volume: number) {
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
}
