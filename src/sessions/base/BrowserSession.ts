import { SessionOptions } from './SessionOptions';

/**
 * An abstract interface to be implemented by any class that provides a session for the user interface to display and control.
 */
// export interface BrowserSession {
//   create: (options: SessionOptions) => BrowserSession;
//   currentSong: Song | null;
//   volume: number;
//   currentTime: number | null;
//   search: (query: string) => Promise<void>;
//   select: (playID: string) => Promise<void>;
//   results: Song[] | null;
//   controls: {
//     playPause: () => void;
//     next: () => void;
//     previous: () => void;
//   };
//   subscribe: <T extends keyof ExcludeMethods<BrowserSession>>(
//     property: T,
//     callback: (value: T) => void
//   ) => void;
//   unsubscribe: <T extends keyof ExcludeMethods<BrowserSession>>(
//     property: T,
//     callback: (value: T) => void
//   ) => void;
//   close: () => Promise<void>;
// }
export type SessionListener = (newValue: any) => void;
export abstract class BrowserSession {
  private _currentSong: Song | null = null;
  private _volume: number = 1;
  private _currentTime: number | null = null;
  private _searchResults: Song[] | null = null;

  private _listeners: Partial<Record<keyof this, Set<SessionListener>>> = {};

  protected constructor() {}

  public abstract search(query: string): Promise<void>;
  public abstract select(playID: string): Promise<void>;

  public abstract controls: {
    playPause: () => void;
    next: () => void;
    previous: () => void;
  };

  public addListener<T extends keyof this>(
    property: T,
    callback: (value: this[T]) => void
  ) {
    if (!(property in this._listeners)) this._listeners[property] = new Set();
    this._listeners[property].add(callback);
  }

  public removeListener<T extends keyof this>(
    property: T,
    callback: (value: this[T]) => void
  ) {
    if (!(property in this._listeners)) return;
    this._listeners[property].delete(callback);
  }

  public get currentSong() {
    return this._currentSong;
  }

  protected set currentSong(value: Song) {
    this._currentSong = value;
    this.updateProperty('currentSong', value);
  }

  public get volume() {
    return this._volume;
  }

  public set volume(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._volume = value;
    this.updateProperty('volume', value);
  }

  public get currentTime() {
    return this._currentTime;
  }

  protected set currentTime(value: number) {
    this._currentTime = value;
    this.updateProperty('currentTime', value);
  }

  public get searchResults() {
    return this._searchResults;
  }

  protected set searchResults(value: Song[]) {
    this._searchResults = value;
    this.updateProperty('searchResults', value);
  }

  public abstract close(): Promise<void>;

  private updateProperty<K extends keyof this, T extends this[K]>(
    property: K,
    value: T
  ) {
    if (property in this._listeners) {
      this._listeners[property].forEach((callback) => callback(value));
    }
  }
}

export interface Progress {
  currentTime: number;
  currentDuration: number;
}

export interface Song {
  song: string;
  artist: string;
  duration: number | string;
  playID?: string;
}
