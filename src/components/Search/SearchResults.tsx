import React, { useContext } from "react";
import useSongList from "../../hooks/useSongList";
import { BrowserSessionContext } from "../../BrowserSessionProvider";
import SelectInput from "ink-select-input/build";
import { Text } from "ink";

export const SearchResults = () => {

  const session = useContext(BrowserSessionContext);

  const songList = useSongList();

  const play = (playID: string) => {
    session.SearchHandler.play(playID);
  }

  const handleSelect = (selection) => {
    console.log(selection);
    session.SearchHandler.play(selection.value);
  }

  const parsedSongSelections = songList?.map(song => {
    const playID = song.playID;
    return ({
      label: `${song.title} | ${song.artist} | ${song.duration}`,
      value: song.playID,
    })
  });


  return (
    <>
      {songList ? 
        (
          <SelectInput items={parsedSongSelections} onSelect={handleSelect} />
        )
        : 
        (
          <Text>Search for a song.</Text>
        )
      }
    </>
  )
}