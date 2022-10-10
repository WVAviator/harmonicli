import { Page } from 'puppeteer';
import { VolumeControl } from '../user-controls/VolumeControl';

export class YTMusicVolumeControl implements VolumeControl {
  private volume = 1;

  constructor(private page: Page) {
    page
      .$eval('#volume-slider', (el) => {
        const maxVolume = +el.getAttribute('max');
        const currentVolume = +el.getAttribute('value');
        return currentVolume / maxVolume;
      })
      .then((volume) => (this.volume = volume));
  }

  public get currentVolume() {
    return this.volume;
  }

  async setVolume(volume: number) {
    if (volume < 0 || volume > 1) return;

    await this.page.$eval('#volume-slider', (el) => {
      const maxVolume = +el.getAttribute('max');
      const targetVolume = Math.floor(volume * maxVolume);
      el.setAttribute('value', targetVolume.toString());
    });
    this.volume = volume;
  }
}
