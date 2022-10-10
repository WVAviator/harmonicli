export type Song = {
  title: string,
  artist: string,
  duration: string,
  playID: string,
}

export type SearchListSubscriber = (songList: Song[]) => void;

export interface SearchHandler {
  songList: Song[],
  play: (playID: string) => void;
  search: (query: string[] | string) => void,
  subscribe: (callback: SearchListSubscriber) => string,
  unsubscribe: (subscriberID: string) => void,
}