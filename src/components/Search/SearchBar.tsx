import React, { useContext, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus } from 'ink';
import { BrowserSessionContext } from '../../BrowserSessionProvider';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
  useFocus({ id: 'menu'});
  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');

  const handleSearchSubmit = function (query: string) {
    session.SearchHandler.search(query);
  }

  return (
    <Box>
      {/* User search */}
      <Box>
        <TextInput placeholder='Search' value={inputValue} onChange={setInputValue} onSubmit={handleSearchSubmit}/>
      </Box>
      {/* Search Results */}
      <Box>
        <SearchResults />
      </Box>
    </Box>
  )
}