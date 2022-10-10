import React, { useContext, useEffect, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus, useInput, useFocusManager } from 'ink';
import { BrowserSessionContext } from '../../BrowserSessionProvider';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
  const { isFocused } = useFocus({ id: 'search-bar'});
  const { focus } = useFocusManager();

  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');
  const [ searchResultActive, setSearchResultActive ] = useState(false);

  useInput((_, key) => {
    if (!isFocused || searchResultActive) return;

    if (key.upArrow) {
      setSearchResultActive(false);
      focus('playback-controls');
    }
    // if (key.downArrow) {
    //   focus('search-selector');
    //   setSearchResultActive(true);
    // }
  });

  const handleSearchSubmit = function (query: string) {
    focus('search-selector');
    setSearchResultActive(true);
    session.SearchHandler.search(query);
  }

  // if (searchResultActive) focus('search-selector');

  const view = () => {
    if (searchResultActive) {
      return (
        <Box>
          <SearchResults state={{searchResultActive, setSearchResultActive}}/>
        </Box>
      );
    }
    if (!isFocused) {
      return (
        <Box>
          <Text>Search 🔎</Text>
        </Box>
      );
    }

    return (
      <Box>
        <TextInput placeholder='Search 🔎' value={inputValue} onChange={setInputValue} onSubmit={handleSearchSubmit}/>
      </Box>
    );

  }

  return (
    <Box 
      borderStyle="round"
      borderColor={isFocused ? 'red' : 'white'}>
      {view()}
    </Box>
  )
}