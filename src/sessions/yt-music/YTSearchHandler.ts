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

    // Reset searchResults on new search
    if (this.searchResults) {
      this.searchResults = null;
    }

    if (query) {
      try {
        if (Array.isArray(query)) query = query.join(' ');

        await this.page.waitForSelector('#icon');

        const isVisible = await this.page.$eval(
          'div.search-box input',
          (el: HTMLElement) => window.getComputedStyle(el).display !== 'none'
        );

        if (!isVisible) {
          await this.page.$eval('#icon', (el: HTMLElement) => el.click());
        }

        const currentQuery = await this.page.$eval(
          'div.search-box input',
          (el: HTMLInputElement) => el.value
        );
        if (currentQuery == query) return;

        // Click search bar (bring it to focus for next steps)
        await this.page.click('div.search-box input'),
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
        this.searchResults = [];
        return;
      }
    }

    // Update songList and send to subscribers
    await this.page.waitForNetworkIdle();
    this.updateSongList();
  }

  private async updateSongList() {
    let error = false;
    try {
      const songResultsSelector = 'a[title="Show song results"]';

      // Make sure we get only songs. Give up after four seconds.
      await this.page.waitForSelector(songResultsSelector, {
        timeout: 4000,
      });

      await Promise.all([
        this.page.click(songResultsSelector),
        this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);

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
      this.searchResults = [];
      return;
    }

    this.searchResults = songs;
  }
}
