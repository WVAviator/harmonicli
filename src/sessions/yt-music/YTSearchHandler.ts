import { Page } from 'puppeteer';
import {
  SearchHandler,
  SearchListSubscriber,
  Song,
} from '../base/SearchHandler';
import crypto from 'crypto';

export class YTSearchHandler implements SearchHandler {
  private page: Page;
  public songList: Song[];
  private subscribers: Record<string, SearchListSubscriber>;

  /**
   * A helper class for managing the search functionality of a YTMusicSession.
   * @param page The Puppeteer page of the YTMusicSession.
   */
  constructor(page: Page) {
    this.page = page;
    this.songList = [];
    this.subscribers = {};
  }

  /**
   * Subscribe to updates to the search list.
   * @param callback A callback to be invoked when the search list changes.
   * @returns A unique id that can be used later to unsubscribe.
   */
  public subscribe(callback: SearchListSubscriber) {
    const subscriberId = crypto.randomBytes(8).toString('hex');
    this.subscribers[subscriberId] = callback;
    return subscriberId;
  }

  /**
   * Unsubscribe from search list updates.
   * @param subscriberID The ID returned from the original call to subscribe.
   */
  public unsubscribe(subscriberID: string) {
    delete this.subscribers[subscriberID];
  }

  /**
   * Activate the selected search result.
   * @param playID The ID passed along with the search list for the selected item.
   */
  public async play(playID: string) {
    if (playID === 'No results found.') return;
    // Have to do it this way becuase some play buttons may be off the screen or under elements that will break things if clicked.
    await this.page.$eval(`.${playID}`, (el: HTMLElement) => el.click());
  }

  /**
   * Execute a search for music and update the song list.
   * @param query A string or string array (that will be joined by a space) to use as the search query.
   */
  public async search(query: string | string[]) {
    if (query) {
      if (Array.isArray(query)) query = query.join(' ');

      const currentQuery = await this.page.$eval(
        'div.search-box input',
        (el: HTMLInputElement) => el.value
      );
      if (currentQuery == query) return;

      // Reset songList.
      this.songList = [];
      Object.values(this.subscribers).forEach((cb: SearchListSubscriber) =>
        cb(this.songList)
      );

      // Click search bar (bring it to focus for next steps)
      await Promise.all([
        this.page.waitForSelector('div.search-box input'),
        this.page.click('div.search-box input'),
      ]);

      // Clear search bar
      await this.page.keyboard.down('Shift');
      for (let i = 0; i < currentQuery.length; i++) {
        await this.page.keyboard.press('ArrowLeft');
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

  private async updateSongList(shouldMinimize: boolean) {
    let error = false;

    if (shouldMinimize) {
      // Minimize player
      await Promise.all([
        this.page.waitForSelector('.player-minimize-button'),
        this.page.click('.player-minimize-button'),
      ]);
    }

    // Click song filter
    await this.page.click('a[title="Show song results"]').catch(_ => error = true);

    // Wait for the song element selector if it exists.
    if (!error) await this.page.waitForSelector('tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer');

    // Check for songs.
    await this.page.$$eval(
      'tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer',
      (songs) => {
        if (songs.length <= 0) error = true;
      }
    );

    // Expand search results
    await this.page
      .$eval(
        'tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer',
        (el: HTMLAnchorElement) => {
          el.click();
        }
      )
      .catch((err) => {
        error = true;
      });

    // If there are errors, show no results found.
    if (error) {
      this.songList = [
        {
          title: 'No results found.',
          artist: 'No results found.',
          duration: 'No results found.',
          playID: 'No results found.',
        },
      ];

      Object.values(this.subscribers).forEach((cb: SearchListSubscriber) =>
        cb(this.songList)
      );
      
      return;
    };

    // Update the songlist on idle.
    await this.page.waitForNetworkIdle();

    // Format the song info so we can pass to the song selector.

    // This didn't work? Will play with later.
    // const songs: Song[] = await this.page.$$eval(
    //   'ytmusic-shelf-renderer div#contents ytmusic-responsive-list-item-renderer',
    //   (elements) => {
    //     return elements.map((element: HTMLSpanElement | HTMLAnchorElement, index: number) => {
    //       if (index >= 11) return;
    //       const playID = `_YTPlayButton-${index}`;
    //       element.querySelector('#play-button')?.setAttribute('class', `${element.getAttribute('class')} ${playID}`);
    //       return ({
    //         title: element.querySelectorAll('a')[0].innerText,
    //         artist: element.querySelectorAll('a')[1].innerText,
    //         duration: element.querySelectorAll('span')[2].innerText,
    //         playID: playID,
    //       });
    //     });
    //   }
    // );

    const songs: Song[] = await this.page.evaluate(() => {
      // Only the first 11 songs will have a play button attached.
      const getSongInfo = (elements) => {
        const info = [];
        elements.forEach(
          (element: HTMLSpanElement | HTMLAnchorElement, index: number) => {
            // There will be a better limit soon™️.
            if (index >= 11) return;

            const playID = `_YTPlayButton-${index}`;
            const playButton = element.querySelector('#play-button');
            if (playButton) {
              playButton.setAttribute(
                'class',
                `${element.getAttribute('class')} ${playID}`
              );
            }
            info.push({
              title: element.querySelectorAll('a')[0].innerText,
              artist: element.querySelectorAll('a')[1].innerText,
              duration: element.querySelectorAll('span')[2].innerText,
              playID: playButton ? playID : null,
            });
          }
        );
        return info;
      };

      return getSongInfo(
        document.querySelectorAll(
          'ytmusic-shelf-renderer div#contents ytmusic-responsive-list-item-renderer'
        )
      );
    });

    // Update the songlist for each hook.
    Object.values(this.subscribers).forEach((cb: SearchListSubscriber) =>
      cb(songs)
    );
  }
}
