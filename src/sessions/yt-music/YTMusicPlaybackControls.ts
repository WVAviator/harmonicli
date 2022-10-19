import { Page } from 'puppeteer';

/**
 * An enum for the different types of controls that map to the appropriate selector in the DOM.
 */
export enum YTControl {
  PlayPause = `#play-pause-button`,
  Next = `tp-yt-paper-icon-button[title="Next song"]`,
  Previous = `tp-yt-paper-icon-button[title="Previous song"]`,
}

export class YTMusicPlaybackControls {
  /**
   * A helper class for managing the playback controls of a YTMusicSession.
   */
  constructor(private page: Page) {}

  private async execute(control: YTControl) {
    try {
      await this.page.waitForSelector(control);
      await this.page.click(control);
    } catch (error) {
      console.log('Error while trying to activate playback controls.');
      console.error(error);
    }
  }

  public async playPause() {
    await this.execute(YTControl.PlayPause);
  }
  public async next() {
    await this.execute(YTControl.Next);
  }
  public async previous() {
    await this.execute(YTControl.Previous);
  }
}
