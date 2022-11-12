import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';
import Gradient from 'ink-gradient';

const MAX_VOLUME = 10;
const VOLUME_STRING = '▁▂▂▃▃▄▄▅▅▆';

/**
 * A focusable component that allows changing the volume of the music. Focus can be set to this component with id 'volume-control'.
 */
const VolumeControl: React.FC<{ isFocused?: boolean }> = ({ isFocused }) => {
  const session = useContext(BrowserSessionContext);
  const [volume, setVolume] = useState(MAX_VOLUME);
  const [isSelected, setIsSelected] = useState(false);

  // const { isFocused } = useFocus({ id: 'volume-control' });
  let { focusNext, focusPrevious } = {focusNext: (...args) => null, focusPrevious: (...args) => null};
  if (isFocused === undefined || isFocused === null) {
    isFocused = useFocus({ id: 'volume-control' }).isFocused;
    focusNext = useFocusManager().focusNext;
    focusPrevious = useFocusManager().focusPrevious;
  }

  const increaseVolume = () => {
    if (volume === MAX_VOLUME) return;
    session.volume = (volume + 1) / MAX_VOLUME;
    setVolume((currentVolume) => currentVolume + 1);
  };

  const decreaseVolume = () => {
    if (volume === 0) return;
    session.volume = (volume - 1) / MAX_VOLUME;
    setVolume((currentVolume) => currentVolume - 1);
  };

  useEffect(() => {
    setVolume(session.volume * MAX_VOLUME);
  }, []);

  useInput((_, key) => {
    if (!isFocused) return;

    // if (key.return) {
    //   if (isSelected) {
    //     setIsSelected(false);
    //     session.volume = volume / MAX_VOLUME;
    //   } else {
    //     setIsSelected(true);
    //   }
    // }

    // if (key.rightArrow && isSelected) {
    //   increaseVolume();
    // }

    // if (key.leftArrow && isSelected) {
    //   decreaseVolume();
    // }

    if (key.rightArrow) {
      increaseVolume();
    }

    if (key.leftArrow) {
      decreaseVolume();
    }

    if (key.upArrow) {
      setIsSelected(false);
      session.volume = volume / MAX_VOLUME;
      focusPrevious();
    }

    if (key.downArrow) {
      setIsSelected(false);
      session.volume = volume / MAX_VOLUME;
      focusNext();
    }
  });

  const volumeString = `🔈 ${VOLUME_STRING.slice(0, volume)}${' '.repeat(
    MAX_VOLUME - volume
  )} 🔊`;

  return (
    <Box>
      <Text color={isFocused ? 'yellow' : 'white'}>{'> '}</Text>
      {/* {isSelected ? (
        <Text color="white">{volumeString}</Text>
      ) : (
        <Gradient name="summer">
          <Text>{volumeString}</Text>
        </Gradient>
      )} */}
        <Gradient name="summer">
          <Text>{volumeString}</Text>
        </Gradient>
    </Box>
  );
};

export default VolumeControl;
