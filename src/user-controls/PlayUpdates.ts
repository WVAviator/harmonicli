export type PlayUpdateSubscriber = (nowPlaying: string) => void;

/**
 * An abstract interface to be implemented by a class that manages subscriptions to the currently playing song and its updates.
 */
export interface PlayUpdates {
  nowPlaying: string;
  subscribe: (callback: PlayUpdateSubscriber) => string;
  unsubscribe: (subscriberId: string) => void;
  forceSongUpdate: () => void;
}
