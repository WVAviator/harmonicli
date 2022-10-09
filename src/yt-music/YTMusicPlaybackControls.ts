import { Page } from 'puppeteer';
import { PlaybackControls } from '../user-controls/PlaybackControls';
import { YTSearchHandler } from './YTSearchHandler';

/**
 * An enum for the different types of controls that map to the appropriate selector in the DOM.
 */
export enum YTControl {
  PlayPause = `#play-pause-button`,
  Next = `tp-yt-paper-icon-button[title="Next song"]`,
  Previous = `tp-yt-paper-icon-button[title="Previous song"]`,
}

export class YTMusicPlaybackControls implements PlaybackControls {

  constructor(private page: Page, private SearchHandler: YTSearchHandler) {}

  public async execute(control: YTControl) {
    await this.page.waitForSelector(control);
    await this.page.click(control);
  }

  public get controlActions() {
    return [
      { label: '⏮', value: () => this.execute(YTControl.Previous) },
      { label: '⏯', value: () => this.execute(YTControl.PlayPause) },
      { label: '⏭', value: () => this.execute(YTControl.Next) },
      { label: '🔎', value: () => this.SearchHandler.search('a') },
    ];
  }
}
