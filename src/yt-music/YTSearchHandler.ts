import { Page } from "puppeteer";
import { SearchHandler, SearchListSubscriber, Song } from "../user-controls/SearchHandler";
import crypto from 'crypto';

export class YTSearchHandler implements SearchHandler {

  private page: Page;
  public songList: Song[];
  private subscribers: {};
  private firstSearch: boolean;

  constructor (page: Page) {
    this.page = page;

    this.songList;

    this.subscribers = {};

    this.firstSearch = true;

  }
  
  subscribe (callback: SearchListSubscriber) {
    const subscriberId = crypto.randomBytes(8).toString('hex');
    this.subscribers[subscriberId] = callback;
    return subscriberId;
  }

  unsubscribe (subscriberID: string) {
    delete this.subscribers[subscriberID];
  }

  async search (query: string | string[]) {
    
    // Minimize player
    await Promise.all([
      this.page.waitForSelector('.player-minimize-button'),
      this.page.click('.player-minimize-button'),
    ]);
    
    // Expand search results      
    await Promise.all([
      this.page.waitForSelector('tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer'),
      this.page.evaluate(() => {
        // @ts-ignore because this element does have the click method.
        document.querySelector('tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer').click()
      }),
    ]);

    // Update the songlist on idle.
    await this.page.waitForNetworkIdle();
    this.updateSongList();

  }

  async execute (item: string) {

  }
  
  async updateSongList () {

    // Format the song info so we can pass to the song selector.
    const songs: Song[] = await this.page.evaluate(() => {

      // Only the first 11 songs will have a play button attached.
      const getSongInfo = (elements) => {
        const info = [];
        elements.forEach((element, index) => {

          // There will be a better limit soon.
          if (index >= 11) return;

          const playID = `_YTPlayButton-${index}`;
          const playButton = element.querySelector('#play-button');
          if (playButton) {
            playButton.setAttribute('class', `${element.getAttribute('class')} ${playID}`);
          }
          info.push({
            title: element.querySelectorAll('a')[0].innerText,
            artist: element.querySelectorAll('a')[1].innerText,
            duration: element.querySelectorAll('span')[2].innerText,
            playID: playButton ? playID : null,
          });
        });
        return info;
      }

      return getSongInfo(document.querySelectorAll('ytmusic-shelf-renderer div#contents ytmusic-responsive-list-item-renderer'));
    });

    console.log(songs);

    // Update the songlist for each hook.
    Object.values(this.subscribers).forEach((cb: SearchListSubscriber) => cb(songs));
  }

}