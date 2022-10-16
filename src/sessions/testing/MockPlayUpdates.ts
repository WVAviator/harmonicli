import { PlayUpdates, PlayUpdateSubscriber } from '../base/PlayUpdates';

export class MockPlayUpdates implements PlayUpdates {
  subscribers = [];
  _nowPlaying = 'Old Town Road | Lil Nas X';

  get nowPlaying() {
    return this._nowPlaying;
  }

  set nowPlaying(value) {
    this._nowPlaying = value;
    console.log('Updated to', this._nowPlaying);
    this.forceSongUpdate();
  }

  subscribe(callback: PlayUpdateSubscriber) {
    this.subscribers.push(callback);
    return '12345';
  }
  unsubscribe(subscriberId: string) {
    this.subscribers.pop();
  }
  forceSongUpdate() {
    console.log('Invoking subs');
    this.subscribers.forEach((sub) => sub(this._nowPlaying));
  }
}
