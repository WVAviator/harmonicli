import { Page } from 'puppeteer';
import { PlaybackControls } from '../user-controls/PlaybackControls';

/**
 * An enum for the different types of controls that map to the appropriate selector in the DOM.
 */
export enum YTControl {
  PlayPause = `#play-pause-button`,
  Next = `tp-yt-paper-icon-button[title="Next song"]`,
  Previous = `tp-yt-paper-icon-button[title="Previous song"]`,
}

export class YTMusicPlaybackControls implements PlaybackControls {
  constructor(private page: Page) {}

  public async execute(control: YTControl) {
    await this.page.waitForSelector(control);
    await this.page.click(control);
  }

  public get controlActions() {
    return [
      { name: 'Play/Pause', value: () => this.execute(YTControl.PlayPause) },
      { name: 'Next Song', value: () => this.execute(YTControl.Next) },
      { name: 'Previous Song', value: () => this.execute(YTControl.Previous) },
    ];
  }
}
