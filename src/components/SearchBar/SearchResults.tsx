import React, { useContext, FC } from 'react';
import useSongList from '../../hooks/useSongList';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import SelectInput from 'ink-select-input/build';
import { Text } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';

type SRState = {
  searchResultActive: boolean;
  setSearchResultActive: React.Dispatch<React.SetStateAction<boolean>>;
  loadingResults: boolean;
  setLoadingResults: React.Dispatch<React.SetStateAction<boolean>>;
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

  const handleSelect = (selection) => {
    state.setSearchResultActive(false);
    session.select(selection.value);
  };

  if (songList) state.setLoadingResults(false);

  const parsedSongSelections = songList?.map((song) => {
    return {
      label: `${song.song} | ${song.artist} | ${song.duration}`,
      value: song.playID,
    };
  });

  const view = () => {

    if (state.loadingResults) {
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

    return (
      <>
        {songList?.length ? (
          <SelectInput items={parsedSongSelections} onSelect={handleSelect} />
        ) : (
          <Text>No results found.</Text>
        )}
      </>
    );

  }

  return view();

};
