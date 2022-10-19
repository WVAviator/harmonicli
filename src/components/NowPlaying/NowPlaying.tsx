import React from 'react';
import { Box } from 'ink';
import useNowPlaying from '../../hooks/useNowPlaying';
import Gradient from 'ink-gradient';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import MarqueeText from '../MarqueeText/MarqueeText';

/**
 * Displays the current song and artist in the current browser context, formatted in bold with a gradient. If the string is too long, it will scroll with a marquee effect.
 */
const NowPlaying: React.FC = () => {
  const { song, artist } = useNowPlaying();
  const [columns] = useStdoutDimensions();

  return (
    <Box paddingX={1} width="50%" borderStyle="round">
      <Gradient name="summer">
        <MarqueeText maxWidth={columns * 0.5 - 4} bold>
          {song || artist ? `${song} | ${artist}` : 'Search for a song below.'}
        </MarqueeText>
      </Gradient>
    </Box>
  );
};

export default NowPlaying;
