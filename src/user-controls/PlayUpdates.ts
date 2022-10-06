export type PlayUpdateSubscriber = (nowPlaying: string) => void;

export interface PlayUpdates {
  nowPlaying: string;
  subscribe: (callback: PlayUpdateSubscriber) => string;
  unsubscribe: (subscriberId: string) => void;
  forceSongUpdate: () => void;
}
