import { Page } from 'puppeteer';
export class YTMusicVolumeControl {
  private volume = 1;

  constructor(private page: Page) {
    this.getInitialVolume();
  }

  private async getInitialVolume() {
    try {
      await this.page.waitForSelector('video');
      this.volume = await this.page.$eval('video', (el: HTMLVideoElement) => {
        return el.volume;
      });
    } catch (error) {
      console.log('Error while trying to read media volume.');
      console.error(error);
    }
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
    try {
      await this.page.evaluate((volume: number) => {
        const volumeSlider: HTMLInputElement =
          document.querySelector('#volume-slider');
        volumeSlider.value = Math.floor(volume * 100).toString();
        volumeSlider.dispatchEvent(new Event('change'));
      }, volume);
      this.volume = volume;
    } catch (error) {
      console.log('Error while trying to update volume.');
      console.error(error);
    }
  }
}
