import { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider';

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
