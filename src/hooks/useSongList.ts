import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../components/BrowserSessionProvider/BrowserSessionProvider';

const useSongList = () => {
  const session = useContext(BrowserSessionContext);
  const [songList, setSongList] = useState(session.SearchHandler.songList);

  useEffect(() => {
    const subscriberId = session.SearchHandler.subscribe((songList) => {
      setSongList(songList);
    });
    return () => {
      session.SearchHandler.unsubscribe(subscriberId);
    };
  }, [session]);

  return songList;
};

export default useSongList;
