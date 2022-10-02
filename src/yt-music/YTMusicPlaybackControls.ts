import { Page } from 'puppeteer';

/**
 * An enum for the different types of controls that map to the appropriate selector in the DOM.
 */
enum PlaybackControl {
  Play = `#play-pause-button`,
  Pause = `#play-pause-button`,
  Next = `tp-yt-paper-icon-button[title="Next song"]`,
  Previous = `tp-yt-paper-icon-button[title="Previous song"]`,
}

export class YTMusicPlaybackControls {
  constructor(private page: Page) {}

  public async executeControl(control: PlaybackControl) {
    await this.page.waitForSelector(control);
    await this.page.click(control);
  }
}
