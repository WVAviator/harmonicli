export type SessionListener = (newValue: any) => void;

/**
 * An abstract class for all types of BrowserSession. Provides a default implementation for basic methods and property subscription.
 */
export abstract class BrowserSession {
  private _currentSong: Song | null = null;
  private _volume: number = 1;
  private _currentTime: number | null = null;
  private _searchResults: Song[] | null = null;

  private _listeners: Partial<Record<keyof this, Set<SessionListener>>> = {};

  protected constructor() {}

  /**
   * Executing a search should populat the searchResults property with new values.
   * @param query
   */
  public abstract search(query: string): Promise<void>;

  /**
   * Should execute the song with the given playID from the search results.
   * @param playID
   */
  public abstract select(playID: string): Promise<void>;

  /**
   * Should provide an implementation for playing, pausing, and changing the song.
   */
  public abstract controls: {
    playPause: () => void;
    next: () => void;
    previous: () => void;
  };

  /**
   * Listen for changes to certain properties in the session instance.
   * @param property A property on this Session instance
   * @param callback A callback to be invoked when the provided property changes
   */
  public addListener<T extends keyof this>(
    property: T,
    callback: (value: this[T]) => void
  ) {
    if (!(property in this._listeners)) this._listeners[property] = new Set();
    this._listeners[property].add(callback);
  }

  /**
   * Remove a previously added listener.
   * @param property The property that the listener was added to
   * @param callback A reference to the same callback that was passed into addListener
   */
  public removeListener<T extends keyof this>(
    property: T,
    callback: (value: this[T]) => void
  ) {
    if (!(property in this._listeners)) return;
    this._listeners[property].delete(callback);
  }

  /**
   * Returns the currently playing song.
   */
  public get currentSong() {
    return this._currentSong;
  }

  protected set currentSong(value: Song) {
    this._currentSong = value;
    this.updateProperty('currentSong', value);
  }

  /**
   * Returns or sets the current volume.
   */
  public get volume() {
    return this._volume;
  }

  public set volume(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._volume = value;
    this.updateProperty('volume', value);
  }

  /**
   * Returns the current progress time of the song.
   */
  public get currentTime() {
    return this._currentTime;
  }

  protected set currentTime(value: number) {
    this._currentTime = value;
    this.updateProperty('currentTime', value);
  }

  /**
   * Returns any current search results that are available to be selected.
   */
  public get searchResults() {
    return this._searchResults;
  }

  protected set searchResults(value: Song[]) {
    this._searchResults = value;
    this.updateProperty('searchResults', value);
  }

  /**
   * This implementation will be invoked when the application is terminated or when the session is discontinued.
   */
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
