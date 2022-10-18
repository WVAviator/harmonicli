import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../components/BrowserSessionProvider/BrowserSessionProvider';

const useSongList = () => {
  const session = useContext(BrowserSessionContext);
  const [songList, setSongList] = useState(session.searchResults);

  useEffect(() => {
    const handleSearchResultsUpdate = (songList) => {
      setSongList(songList);
    };
    session.addListener('searchResults', handleSearchResultsUpdate);
    return () => {
      session.removeListener('searchResults', handleSearchResultsUpdate);
    };
  }, [session]);

  return songList;
};

export default useSongList;
