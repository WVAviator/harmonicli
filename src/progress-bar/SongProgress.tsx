import React from 'react';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import { Box, Text } from 'ink';
import useSongProgress from '../hooks/useSongProgress';
import Gradient from 'ink-gradient';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

/**
 * Converts a number representing seconds into a time string with both minutes and seconds.
 * @param time The time in seconds
 * @returns A string formatted with minutes and seconds, e.g. 5:34
 */
const getFormattedTimeString = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minutesString = minutes.toString();
  const secondsString = `${seconds < 10 ? '0' : ''}${seconds.toString()}`;

  return `${minutesString}:${secondsString}`;
};

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
          percent={currentTime / currentDuration}
          width={columns * 0.5 - 2}
        />
      </Gradient>
      <Text>{timeString}</Text>
    </Box>
  );
};

export default SongProgress;
