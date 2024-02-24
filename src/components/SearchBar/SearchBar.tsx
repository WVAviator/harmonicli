import React, { useContext, useState } from 'react';
import TextInput from 'ink-text-input';
import { Box } from 'ink';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');
  const [searchResultActive, setSearchResultActive] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleSearchSubmit = function (query: string) {
    setSearchResultActive(true);
    setLoadingResults(true);
    session.search(query);
    setInputValue('');
  };

  const view = () => {
    if (searchResultActive) {
      return (
        <Box>
          <SearchResults
            state={{
              searchResultActive,
              setSearchResultActive,
              loadingResults,
              setLoadingResults,
            }}
          />
        </Box>
      );
    }

    return (
      <TextInput
        // placeholder=" 🔎"
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSearchSubmit}
      />
    );
  };

  return view();
};
