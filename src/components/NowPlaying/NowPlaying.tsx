import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import useNowPlaying from '../../hooks/useNowPlaying';
import Gradient from 'ink-gradient';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

interface NowPlayingProps {
  width?: number | `${number}%`;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ width = '40%' }) => {
  const nowPlaying = useNowPlaying();
  const [startChar, setStartChar] = useState(0);
  const [columns] = useStdoutDimensions();

  const colWidth =
    typeof width === 'number'
      ? width
      : columns * (+width.slice(0, width.length - 1) / 100);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let endDelay: NodeJS.Timeout;
    let reachedEnd = false;
    const startDelay = setTimeout(() => {
      interval = setInterval(
        () =>
          setStartChar((startChar) => {
            if (startChar === nowPlaying.length - colWidth) {
              if (!reachedEnd)
                endDelay = setTimeout(() => {
                  setStartChar(0);
                  reachedEnd = false;
                }, 1000);
              reachedEnd = true;
              return startChar;
            }
            return startChar + 1;
          }),
        250
      );
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(endDelay);
      clearInterval(interval);
    };
  }, [nowPlaying]);

  const truncatedText = nowPlaying.slice(startChar, startChar + colWidth);

  return (
    <Box padding={1} width="50%" borderStyle="single">
      <Gradient name="rainbow">
        <Text bold>{truncatedText}</Text>
      </Gradient>
    </Box>
  );
};

export default NowPlaying;
