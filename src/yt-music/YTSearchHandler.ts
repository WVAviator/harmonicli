import { Page } from "puppeteer";
import { SearchHandler, SearchListSubscriber, SearchQuerySubscriber, Song } from "../user-controls/SearchHandler";
import crypto from 'crypto';

export class YTSearchHandler implements SearchHandler {

  private page: Page;
  public songList: Song[];
  private subscribers: {};

  constructor (page: Page) {
    this.page = page;
    this.songList = [];
    this.subscribers = {};
  }
  
  subscribe (callback: SearchListSubscriber) {
    const subscriberId = crypto.randomBytes(8).toString('hex');
    this.subscribers[subscriberId] = callback;
    return subscriberId;
  }

  unsubscribe (subscriberID: string) {
    delete this.subscribers[subscriberID];
  }

  async play (playID: string) {
    if (playID === 'No results found.') return;
    // Have to do it this way becuase some play buttons may be off the screen or under elements that will break things if clicked.
    await this.page.evaluate(
      (playID) => {
        // @ts-ignore because it will have click method.
        document.querySelector(`.${playID}`).click();
      },
      playID
    );
  }

  async search (query: string | string[]) {

    if (query) {
      if (Array.isArray(query)) query = query.join(' ');

      // @ts-ignore becuase value does exist on Element
      const currentQuery = await this.page.evaluate(() => document.querySelector('div.search-box input').value);
      if (currentQuery == query) return;

      // Reset songList.
      this.songList = [];
      Object.values(this.subscribers).forEach((cb: SearchListSubscriber) => cb(this.songList));



      // Click search bar (bring it to focus for next steps)
      await Promise.all([
        this.page.waitForSelector('div.search-box input'),
        this.page.click('div.search-box input'),
      ]);
      
      // Clear search bar
      await this.page.keyboard.down('Shift');
      for (let i = 0; i < currentQuery.length; i++) {
        await this.page.keyboard.press("ArrowLeft");
      }
      await this.page.keyboard.up('Shift');
      await this.page.keyboard.press('Backspace');

      // Enter new query
      await this.page.keyboard.type(query);
      await this.page.keyboard.press('Enter');
    }

    // Update songList and send to subscribers
    await this.page.waitForNetworkIdle();
    this.updateSongList(query.length <= 0);

  }
  
  private async updateSongList (shouldMinimize: boolean) {
    let error = false;

    if (shouldMinimize) {
      // Minimize player
      await Promise.all([
        this.page.waitForSelector('.player-minimize-button'),
        this.page.click('.player-minimize-button'),
      ]);
    }
    
    // Expand search results      
    await Promise.all([
      this.page.waitForSelector('tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer'),
      this.page.evaluate(() => {
        // @ts-ignore because this element does have the click method.
        document.querySelector('tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer').click()
      }).catch(err => {
        // TODO: better error handling
        this.songList = [{title: 'No results found.', artist: 'No results found.', duration: 'No results found.', playID: 'No results found.'}];
        error = true;
        Object.values(this.subscribers).forEach((cb: SearchListSubscriber) => cb(this.songList));
      }),
    ]);

    if (error) return;

    // Update the songlist on idle.
    await this.page.waitForNetworkIdle();

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

    // Update the songlist for each hook.
    Object.values(this.subscribers).forEach((cb: SearchListSubscriber) => cb(songs));
  }

}