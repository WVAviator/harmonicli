export type Song = {
  title: string,
  artist: string,
  duration: string,
  playID: string,
}

export type SearchListSubscriber = (songList: Song[]) => void;

export interface SearchHandler {
  songList: Song[],
  search: (query: string[] | string) => void,
  subscribe: (callback: SearchListSubscriber) => string,
  unsubscribe: (subscriberID: string) => void,
}