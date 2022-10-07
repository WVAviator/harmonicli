import React from 'react';
import { Box } from 'ink';
import useNowPlaying from '../../hooks/useNowPlaying';
import Gradient from 'ink-gradient';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import MarqueeText from '../MarqueeText/MarqueeText';

const NowPlaying: React.FC = () => {
  const nowPlaying = useNowPlaying();
  const [columns] = useStdoutDimensions();

  return (
    <Box paddingX={1} width="50%" borderStyle="round">
      <Gradient name="summer">
        <MarqueeText maxWidth={columns * 0.5 - 4} bold>
          {nowPlaying}
        </MarqueeText>
      </Gradient>
    </Box>
  );
};

export default NowPlaying;
