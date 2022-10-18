import React, { useContext, FC } from 'react';
import useSongList from '../../hooks/useSongList';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import SelectInput from 'ink-select-input/build';
import { Text, useFocusManager, useInput } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import { getFormattedTimeString } from '../../utilities/formatTime';

type SRState = {
  searchResultActive: boolean;
  setSearchResultActive: React.Dispatch<React.SetStateAction<boolean>>;
};

interface SearchResultsProps {
  /**
   * The React state representing whether the user has initiated a search.
   */
  state: SRState;
}

export const SearchResults: FC<SearchResultsProps> = ({ state }) => {
  const session = useContext(BrowserSessionContext);
  const songList = useSongList();

  const { focus } = useFocusManager();

  useInput((_, key) => {
    if (!state.searchResultActive) return;

    if (key.leftArrow || key.escape) {
      state.setSearchResultActive(false);
      focus('search-bar');
    }
    if (key.rightArrow) {
      // do nothing for now.
    }
  });

  const handleSelect = (selection) => {
    state.setSearchResultActive(false);
    focus('playback-controls');
    session.select(selection.value);
  };

  const parsedSongSelections = songList?.map((song) => {
    return {
      label: `${song.song} | ${song.artist} | ${song.duration}`,
      value: song.playID,
    };
  });

  if (state.searchResultActive) {
    if (songList?.at(0) !== undefined) {
      return (
        <>
          <SelectInput items={parsedSongSelections} onSelect={handleSelect} />
        </>
      );
    }
    return (
      <Text>
        <Gradient name="summer">
          <Text>
            <Spinner type="bouncingBall" />
          </Text>
        </Gradient>
        {' Loading Results'}
      </Text>
    );
  }

  return null;
};
