import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider';

const useNowPlaying = () => {
  const session = useContext(BrowserSessionContext);
  const [nowPlaying, setNowPlaying] = useState(session.PlayUpdates.nowPlaying);

  useEffect(() => {
    const subscriberId = session.PlayUpdates.subscribe((nowPlaying) => {
      setNowPlaying(nowPlaying);
    });
    return () => {
      session.PlayUpdates.unsubscribe(subscriberId);
    };
  }, [session]);

  return nowPlaying;
};

export default useNowPlaying;
