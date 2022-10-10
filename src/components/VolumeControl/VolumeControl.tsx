import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserSessionContext } from '../../BrowserSessionProvider';

const MAX_VOLUME = 10;
const VOLUME_STRING = '▁▂▂▃▃▄▄▅▅▆';

const VolumeControl: React.FC = () => {
  const session = useContext(BrowserSessionContext);
  const [volume, setVolume] = useState(MAX_VOLUME);
  const [isSelected, setIsSelected] = useState(false);

  const { isFocused } = useFocus({ id: 'volume-control' });
  const { focusNext, focusPrevious } = useFocusManager();

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
      setVolume((currentVolume) => {
        if (currentVolume === MAX_VOLUME) return currentVolume;
        return currentVolume + 1;
      });
    }

    if (key.leftArrow && isSelected) {
      setVolume((currentVolume) => {
        if (currentVolume === 0) return currentVolume;
        return currentVolume - 1;
      });
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
      <Text color={isSelected ? 'yellow' : 'white'}>{volumeString}</Text>
    </Box>
  );
};

export default VolumeControl;
