export type PlayUpdateSubscriber = (nowPlaying: string) => void;

export interface PlayUpdates {
  nowPlaying: string;
  subscribe: (callback: PlayUpdateSubscriber) => void;
  forceSongUpdate: () => void;
}
