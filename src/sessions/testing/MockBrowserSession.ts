import { BrowserSession, Song } from '../base/BrowserSession';

export class MockBrowserSession extends BrowserSession {
  public static create() {
    return new MockBrowserSession();
  }
  public search(query: string): Promise<void> {
    return;
  }
  public select(playID: string): Promise<void> {
    return;
  }
  public controls: {
    playPause: () => void;
    next: () => void;
    previous: () => void;
  };
  public close(): Promise<void> {
    return;
  }

  public updateCurrentSong(song: Song) {
    this.currentSong = song;
  }
}
