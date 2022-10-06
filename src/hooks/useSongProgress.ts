import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider';

/**
 * Get the progress and duration of the song playing in the current browser session context.
 * @returns {Progress} An object with currentTime and currentDuration properties.
 */
const useSongProgress = () => {
  const session = useContext(BrowserSessionContext);
  const [currentProgress, setCurrentProgress] = useState(
    session.ProgressUpdates.currentProgress
  );

  useEffect(() => {
    const subscriberId = session.ProgressUpdates.subscribe(
      (currentProgress) => {
        setCurrentProgress(currentProgress);
      }
    );

    return () => {
      session.ProgressUpdates.unsubscribe(subscriberId);
    };
  }, [session]);

  return currentProgress;
};

export default useSongProgress;
