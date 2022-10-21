import React, { useContext, useEffect, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus, useInput, useFocusManager } from 'ink';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import { SearchResults } from './SearchResults';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';

export const SearchBar = () => {
  const { isFocused } = useFocus({ id: 'search-bar' });
  const { focus, focusPrevious, focusNext } = useFocusManager();
  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');
  const [searchResultActive, setSearchResultActive] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  useInput((_, key) => {
    if (!isFocused || searchResultActive) return;

    if (key.upArrow) {
      setSearchResultActive(false);
      focusPrevious();
    }
    if (key.downArrow) {
      setSearchResultActive(false);
      focusNext();
    }
  });

  useEffect(() => {
    const handleSearchResultsUpdate = () => {
      setLoadingResults(false);
    };
    session.addListener('searchResults', handleSearchResultsUpdate);
    return () => {
      session.removeListener('searchResults', handleSearchResultsUpdate);
    };
  }, []);

  const handleSearchSubmit = function (query: string) {
    focus('search-selector');
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
    if (!isFocused) {
      return (
        <Box>
          <Text>Search 🔎</Text>
        </Box>
      );
    }

    return (
      <Box>
        <TextInput
          placeholder="Search 🔎"
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSearchSubmit}
        />
      </Box>
    );
  };

  return (
    <Box borderStyle="round" borderColor={isFocused ? 'yellow' : 'white'}>
      {view()}
    </Box>
  );
};
