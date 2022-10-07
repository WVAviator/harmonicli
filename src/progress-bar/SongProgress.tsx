import React from 'react';
import ProgressBar from 'ink-progress-bar';
import { Box } from 'ink';
import useSongProgress from '../hooks/useSongProgress';

const SongProgress = () => {
  const { currentTime, currentDuration } = useSongProgress();

  return (
    <Box marginBottom={0.5} borderStyle="round">
      <ProgressBar color="blue" percent={currentTime / currentDuration} />
    </Box>
  );
};

export default SongProgress;
