import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../../BrowserSessionProvider';
import Gradient from 'ink-gradient';

const MAX_VOLUME = 10;
const VOLUME_STRING = '▁▂▂▃▃▄▄▅▅▆';

const VolumeControl: React.FC = () => {
  const session = useContext(BrowserSessionContext);
  const [volume, setVolume] = useState(MAX_VOLUME);
  const [isSelected, setIsSelected] = useState(false);

  const { isFocused } = useFocus({ id: 'volume-control' });
  const { focusNext, focusPrevious } = useFocusManager();

  const increaseVolume = () => {
    if (volume === MAX_VOLUME) return;
    session.VolumeControl.setVolume((volume + 1) / MAX_VOLUME);
    setVolume((currentVolume) => currentVolume + 1);
  };

  const decreaseVolume = () => {
    if (volume === 0) return;
    session.VolumeControl.setVolume((volume - 1) / MAX_VOLUME);
    setVolume((currentVolume) => currentVolume - 1);
  };

  useEffect(() => {
    setVolume(session.VolumeControl.currentVolume * MAX_VOLUME);
  }, []);

  useInput((_, key) => {
    if (!isFocused) return;

    if (key.return) {
      if (isSelected) {
        setIsSelected(false);
        session.VolumeControl.setVolume(volume / MAX_VOLUME);
      } else {
        setIsSelected(true);
      }
    }

    if (key.rightArrow && isSelected) {
      increaseVolume();
    }

    if (key.leftArrow && isSelected) {
      decreaseVolume();
    }

    if (key.upArrow) {
      setIsSelected(false);
      session.VolumeControl.setVolume(volume / MAX_VOLUME);
      focusPrevious();
    }

    if (key.downArrow) {
      setIsSelected(false);
      session.VolumeControl.setVolume(volume / MAX_VOLUME);
      focusNext();
    }
  });

  const volumeString = `🔈 ${VOLUME_STRING.slice(0, volume)}${' '.repeat(
    MAX_VOLUME - volume
  )} 🔊`;

  return (
    <Box>
      <Text color={isFocused ? 'yellow' : 'white'}>{'> '}</Text>
      {isSelected ? (
        <Text color="white">{volumeString}</Text>
      ) : (
        <Gradient name="summer">
          <Text>{volumeString}</Text>
        </Gradient>
      )}
    </Box>
  );
};

export default VolumeControl;
