import React, { useContext } from "react";
import useSongList from "../../hooks/useSongList";
import { BrowserSessionContext } from "../../BrowserSessionProvider";
import SelectInput from "ink-select-input/build";
import { Text, useFocus, useFocusManager, useInput } from "ink";

export const SearchResults = () => {

  const session = useContext(BrowserSessionContext);

  const songList = useSongList();

  const { isFocused } = useFocus({id: 'search-selector'});
  const { focusNext, focusPrevious, focus } = useFocusManager();

  useInput ((_, key) => {
    if (!isFocused) return;

    if (key.leftArrow) {
      // focusPrevious();
      focus('search-bar');
    }
    if (key.rightArrow) {
      // focusNext();
    }
  })

  const handleSelect = (selection) => {
    focus('search-bar');
    session.SearchHandler.play(selection.value);
  }

  const parsedSongSelections = songList?.map(song => {
    return ({
      label: `${song.title} | ${song.artist} | ${song.duration}`,
      value: song.playID,
    })
  });

  return (
    <>
      {songList && isFocused ? 
        (
          <SelectInput items={parsedSongSelections} onSelect={handleSelect} />
        )
        : 
        (
          <></>
        )
      }
    </>
  )
}