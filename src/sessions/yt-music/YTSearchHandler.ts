import { Page } from 'puppeteer';
import { Song } from '../base/BrowserSession';

export class YTSearchHandler {
  private _searchResults: Song[];

  /**
   * A helper class for managing the search functionality of a YTMusicSession.
   * @param page The Puppeteer page of the YTMusicSession.
   */
  constructor(
    private page: Page,
    private setSearchResults: (value: Song[]) => void
  ) {}

  public get searchResults() {
    return this._searchResults;
  }

  private set searchResults(value: Song[]) {
    this._searchResults = value;
    this.setSearchResults(value);
  }

  /**
   * Activate the selected search result.
   * @param playID The ID passed along with the search list for the selected item.
   */
  public async play(playID: string) {
    if (playID === 'No results found.') return;
    try {
      // Have to do it this way becuase some play buttons may be off the screen or under elements that will break things if clicked.
      await this.page.$eval(`.${playID}`, (el: HTMLElement) => el.click());
    } catch (error) {
      console.log('Error in trying to play song with ID', playID);
      console.error(error);
    }
  }

  /**
   * Execute a search for music and update the song list.
   * @param query A string or string array (that will be joined by a space) to use as the search query.
   */
  public async search(query: string | string[]) {
    if (query) {
      try {
        if (Array.isArray(query)) query = query.join(' ');

        const currentQuery = await this.page.$eval(
          'div.search-box input',
          (el: HTMLInputElement) => el.value
        );
        if (currentQuery == query) return;

        // Reset songList.
        this.searchResults = [];

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
      } catch (error) {
        console.log('Error occurred when trying to search for query:', query);
        console.error(error);
      }
    }

    // Update songList and send to subscribers
    await this.page.waitForNetworkIdle();
    this.updateSongList(query.length <= 0);
  }

  private async updateSongList(shouldMinimize: boolean) {
    let error = false;
    try {
      if (shouldMinimize) {
        // Minimize player
        await Promise.all([
          this.page.waitForSelector('.player-minimize-button'),
          this.page.click('.player-minimize-button'),
        ]);
      }

      // Click song filter
      await this.page.click('a[title="Show song results"]');

      // Wait for the song element selector if it exists.
      if (!error)
        await this.page.waitForSelector(
          'tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer'
        );

      // Check for songs.
      await this.page.$$eval(
        'tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer',
        (songs) => {
          if (songs.length <= 0) error = true;
        }
      );

      // Expand search results
      await this.page.$eval(
        'tp-yt-paper-button yt-formatted-string.ytmusic-shelf-renderer',
        (el: HTMLAnchorElement) => {
          el.click();
        }
      );

      // If there are errors, show no results found.
    } catch (error) {
      console.log('Error occurred while updating the song list.');
      console.error(error);

      this.searchResults = [];
      return;
    }

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

    let songs: Song[] = [];

    try {
      songs = await this.page.evaluate(() => {
        // Only the first 11 songs will have a play button attached.
        const getSongInfo = (elements) => {
          const info: Song[] = [];
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
                song: element.querySelectorAll('a')[0].innerText,
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
    } catch (error) {
      console.log(
        'Error occurred when trying to load songs for search results.'
      );
      console.error(error);
    }

    this.searchResults = songs;
  }
}
