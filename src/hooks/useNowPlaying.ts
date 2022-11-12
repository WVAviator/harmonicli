import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../components/BrowserSessionProvider/BrowserSessionProvider';
import { Song } from '../sessions/base/BrowserSession';

/**
 * Get the name of the song and artist that are playing in the current browser session context.
 * @returns {string} A formatted string with song name and artist name.
 */
const useNowPlaying = () => {
  const session = useContext(BrowserSessionContext);
  const [nowPlaying, setNowPlaying] = useState<Song>({
    song: null,
    artist: null,
    duration: 0,
  });

  useEffect(() => {
    const handleSongUpdate = (value: Song) => {
      setNowPlaying(value);
    };
    session.addListener('currentSong', handleSongUpdate);
    return () => {
      session.removeListener('currentSong', handleSongUpdate);
    };
  }, [session]);

  return nowPlaying;
};

export default useNowPlaying;
