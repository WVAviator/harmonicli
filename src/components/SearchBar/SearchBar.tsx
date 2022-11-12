import React, { useContext, useEffect, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus, useInput, useFocusManager } from 'ink';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import { SearchResults } from './SearchResults';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';

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
          {loadingResults ? (
            <Text>
              <Gradient name="summer">
                <Text>
                  <Spinner type="bouncingBall" />
                </Text>
              </Gradient>
              {' Loading Results'}
            </Text>
          ) : (
            <SearchResults
              state={{ searchResultActive, setSearchResultActive }}
            />
          )}
        </Box>
      );
    }

    return (
      <TextInput
        placeholder="Search 🔎"
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSearchSubmit}
      />
    );
  };


  return view();
};
