import { Song } from './../sessions/base/BrowserSession';
import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../components/BrowserSessionProvider/BrowserSessionProvider';
import { getValueFromTimeString } from '../utilities/formatTime';

/**
 * Get the progress and duration of the song playing in the current browser session context.
 * @returns {Progress} An object with currentTime and currentDuration properties.
 */
const useSongProgress = () => {
  const session = useContext(BrowserSessionContext);
  const [currentTime, setCurrentTime] = useState<number>(
    session.currentTime || 0
  );
  const [currentDuration, setCurrentDuration] = useState<number>(
    getValueFromTimeString(session.currentSong?.duration ?? 0)
  );

  useEffect(() => {
    const handleTimeUpdate = (value: number) => setCurrentTime(value);
    const handleDurationUpdate = ({ duration }: Song) =>
      setCurrentDuration(getValueFromTimeString(duration));

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
