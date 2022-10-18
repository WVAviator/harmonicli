import React from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Box, Text } from 'ink';
import useSongProgress from '../../hooks/useSongProgress';
import Gradient from 'ink-gradient';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import {
  getFormattedTimeString,
  getValueFromTimeString,
} from '../../utilities/formatTime';

/**
 * Displays song progress as a progress bar and adjacent time string.
 */
const SongProgress = () => {
  const { currentTime, currentDuration } = useSongProgress();
  const [columns] = useStdoutDimensions();

  const timeString = ` ${getFormattedTimeString(
    currentTime
  )} / ${getFormattedTimeString(currentDuration)} `;

  return (
    <Box
      borderStyle="round"
      width={columns * 0.5 + 14}
      height={3}
      justifyContent="space-between"
    >
      <Gradient name="summer">
        <ProgressBar
          percent={currentTime / getValueFromTimeString(currentDuration)}
          width={columns * 0.5 - 2}
        />
      </Gradient>
      <Text>{timeString}</Text>
    </Box>
  );
};

export default SongProgress;
