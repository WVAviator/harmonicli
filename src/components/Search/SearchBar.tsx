import React, { useContext, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus, useInput, useFocusManager } from 'ink';
import { BrowserSessionContext } from '../../BrowserSessionProvider';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
  const { isFocused } = useFocus({ id: 'search-bar'});
  const { focusNext, focusPrevious, focus } = useFocusManager();

  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');

  useInput((_, key) => {
    if (!isFocused) return;

    if (key.upArrow && isFocused) {
      focus('playback-controls');
    }
    if (key.downArrow && isFocused) {
      focus('search-selector');
    }
  });

  const handleSearchSubmit = function (query: string) {
    focus('search-selector');
    session.SearchHandler.search(query);
  }

  // const focusedElements = () => {
  //   if (isFocused) {
  //     return <TextInput placeholder='Search' value={inputValue} onChange={setInputValue} onSubmit={handleSearchSubmit}/>
  //   } else {

  //   }
  // }

  return (
    <Box 
      borderStyle="round"
      borderColor={isFocused ? 'red' : 'white'}
    >
      {/* User search */}
      <Box>
        {isFocused ? <TextInput placeholder='Search' value={inputValue} onChange={setInputValue} onSubmit={handleSearchSubmit}/> : <Text>Search</Text>}
      </Box>
      {/* Search Results */}
      <Box>
        <SearchResults />
      </Box>
    </Box>
  )
}