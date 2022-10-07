import React from 'react';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import { Box, Text } from 'ink';
import useSongProgress from '../hooks/useSongProgress';
import Gradient from 'ink-gradient';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

const getFormattedTimeString = (n: number) => {
  const minutes = Math.floor(n / 60);
  const seconds = Math.floor(n % 60);

  const minutesString = minutes.toString();
  const secondsString = `${seconds < 10 ? '0' : ''}${seconds.toString()}`;

  return `${minutesString}:${secondsString}`;
};

const SongProgress = () => {
  const { currentTime, currentDuration } = useSongProgress();
  const [columns] = useStdoutDimensions();

  const timeString = ` ${getFormattedTimeString(
    currentTime
  )} / ${getFormattedTimeString(currentDuration)} `;

  return (
    <Box
      marginBottom={0.5}
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
