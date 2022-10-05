import React from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider';
import { useState, useContext, useEffect } from 'react';
import ProgressBar from 'ink-progress-bar';
import { Box } from 'ink';

const SongProgress = () => {

  const session = useContext(BrowserSessionContext);
  const [currentProgress, setCurrentProgress] = useState(session.ProgressUpdates.currentProgress);

  useEffect(() => {
    session.ProgressUpdates.subscribe((currentProgress) => {
      setCurrentProgress(currentProgress);
    });

  }, []);

  return (
    <Box marginBottom={0.5} borderStyle="round">
      <ProgressBar
        color="blue"
        percent={currentProgress.currentTime / currentProgress.currentDuration}
      />
    </Box>
  )
}

export default SongProgress;