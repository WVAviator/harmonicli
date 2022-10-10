import React, { useContext, FC } from "react";
import useSongList from "../../hooks/useSongList";
import { BrowserSessionContext } from "../../BrowserSessionProvider";
import SelectInput from "ink-select-input/build";
import { Text, useFocusManager, useInput } from "ink";
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';

type SRState = {
  searchResultActive: boolean,
  setSearchResultActive: React.Dispatch<React.SetStateAction<boolean>>,
}

export const SearchResults:FC<{state: SRState}> = ({state}) => {

  const session = useContext(BrowserSessionContext);
  const songList = useSongList();

  const { focus } = useFocusManager();

  useInput ((_, key) => {
    if (!state.searchResultActive) return;

    if (key.leftArrow) {
      state.setSearchResultActive(false);
      focus('search-bar');
    }
    if (key.rightArrow) {
      // do nothing for now.
    }
  })

  const handleSelect = (selection) => {
    state.setSearchResultActive(false);
    focus('playback-controls');
    session.SearchHandler.play(selection.value);
  }

  const parsedSongSelections = songList?.map(song => {
    return ({
      label: `${song.title} | ${song.artist} | ${song.duration}`,
      value: song.playID,
    })
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

  return (
    <></>
  );
}