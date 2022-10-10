export type PlayUpdateSubscriber = (nowPlaying: string) => void;

/**
 * An abstract interface to be implemented by a class that manages subscriptions to the currently playing song and its updates.
 */
export interface PlayUpdates {
  /**
   * THis should return a string formatted to display the song and artist.
   */
  nowPlaying: string;
  /**
   * This should allow subscriptions to nowPlaying updates and return a unique identifier.
   */
  subscribe: (callback: PlayUpdateSubscriber) => string;
  /**
   * This should remove a callback from subscriptions based on its unique identifier.
   */
  unsubscribe: (subscriberId: string) => void;
  /**
   * This should manually invoke a song update.
   */
  forceSongUpdate: () => void;
}
