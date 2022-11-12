import React, { useContext, useEffect, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus, useInput, useFocusManager } from 'ink';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');
  const [searchResultActive, setSearchResultActive] = useState(false);

  const handleSearchSubmit = function (query: string) {
    setSearchResultActive(true);
    session.search(query);
  };

  const view = () => {
    if (searchResultActive) {
      return (
        <SearchResults
          state={{ searchResultActive, setSearchResultActive }}
        />
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
