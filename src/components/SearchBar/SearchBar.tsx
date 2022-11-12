import React, { useContext, useEffect, useState } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useFocus, useInput, useFocusManager } from 'ink';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
  // const { isFocused } = useFocus({ id: 'search-bar' });
  // const { focus, focusPrevious, focusNext } = useFocusManager();
  const session = useContext(BrowserSessionContext);
  const [inputValue, setInputValue] = useState('');
  const [searchResultActive, setSearchResultActive] = useState(false);


  // useEffect(() => {
  //   return () => {
  //     setSearchResultActive(false);
  //   }
  // });

  // useInput((_, key) => {
  //   // if (!isFocused || searchResultActive) return;
  //   if (searchResultActive) return;

  //   if (key.upArrow) {
  //     setSearchResultActive(false);
  //     // focusPrevious();
  //   }
  //   if (key.downArrow) {
  //     setSearchResultActive(false);
  //     // focusNext();
  //   }
  // });

  const handleSearchSubmit = function (query: string) {
    // focus('search-selector');
    setSearchResultActive(true);
    session.search(query);
  };

  // const view = () => {
  //   if (searchResultActive) {
  //     return (
  //       <Box>
  //         <SearchResults
  //           state={{ searchResultActive, setSearchResultActive }}
  //         />
  //       </Box>
  //     );
  //   }
  //   if (!isFocused) {
  //     return (
  //       <Box>
  //         <Text>Search 🔎</Text>
  //       </Box>
  //     );
  //   }

  //   return (
  //     <Box>
  //       <TextInput
  //         placeholder="Search 🔎"
  //         value={inputValue}
  //         onChange={setInputValue}
  //         onSubmit={handleSearchSubmit}
  //       />
  //     </Box>
  //   );
  // };

  const view = () => {
    if (searchResultActive) {
      return (
        // <Box>
          <SearchResults
            state={{ searchResultActive, setSearchResultActive }}
          />
        // {/* </Box> */}
      );
    }

    return (
      // <Box>
        <TextInput
          placeholder="Search 🔎"
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSearchSubmit}
        />
      // </Box>
    );
  };


  return view();
};
