import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider';

/**
 * Get the name of the song and artist that are playing in the current browser session context.
 * @returns {string} A formatted string with song name and artist name.
 */
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
