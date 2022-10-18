import { Song } from './../sessions/base/BrowserSession';
import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../components/BrowserSessionProvider/BrowserSessionProvider';

/**
 * Get the progress and duration of the song playing in the current browser session context.
 * @returns {Progress} An object with currentTime and currentDuration properties.
 */
const useSongProgress = () => {
  const session = useContext(BrowserSessionContext);
  const [currentTime, setCurrentTime] = useState(session.currentTime);
  const [currentDuration, setCurrentDuration] = useState(
    session.currentSong.duration
  );

  useEffect(() => {
    const handleTimeUpdate = (value: number) => setCurrentTime(value);
    const handleDurationUpdate = ({ duration }: Song) =>
      setCurrentDuration(duration);

    session.addListener('currentTime', handleTimeUpdate);
    session.addListener('currentSong', handleDurationUpdate);

    return () => {
      session.removeListener('currentTime', handleTimeUpdate);
      session.removeListener('currentSong', handleDurationUpdate);
    };
  }, [session]);

  return { currentTime, currentDuration };
};

export default useSongProgress;
