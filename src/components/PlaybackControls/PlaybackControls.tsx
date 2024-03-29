import { Box, Text, useFocus, useInput } from 'ink';
import React, { useContext, useMemo, useState } from 'react';
import { BrowserSessionContext } from '../BrowserSessionProvider/BrowserSessionProvider';

/**
 * Displays available playback controls in the current browser context. The controls are displayed in adjacent boxes and can be selected with left and right arrows when the component is focused.
 *
 * The component can be focused with focus ID 'playback-controls'.
 */
const PlaybackControls: React.FC<{ isFocused?: boolean }> = ({ isFocused }) => {
  const session = useContext(BrowserSessionContext);
  const controls = useMemo(() => {
    return [
      { label: '⏮', value: () => session.controls.previous() },
      { label: '⏯', value: () => session.controls.playPause() },
      { label: '⏭', value: () => session.controls.next() },
    ];
  }, [session]);

  const [selectedControlIndex, setSelectedControlIndex] = useState(1);

  if (isFocused === undefined || isFocused === null) {
    isFocused = useFocus({
      autoFocus: true,
      id: 'playback-controls',
    }).isFocused;
  }

  useInput((char, key) => {
    if (!isFocused) return;

    if (key.rightArrow || char === 'l') {
      setSelectedControlIndex((selectedControlIndex + 1) % controls.length);
    }
    if (key.leftArrow || char === 'h') {
      setSelectedControlIndex(
        (selectedControlIndex + controls.length - 1) % controls.length
      );
    }
    if (key.downArrow || char === 'j') {
      setSelectedControlIndex(1);
    }
    if (key.return) {
      controls[selectedControlIndex].value();
      setSelectedControlIndex(selectedControlIndex);
    }
  });

  return (
    <Box alignItems="center" width={20}>
      {controls.map((control, index) => (
        <Box
          key={index}
          borderStyle="doubleSingle"
          paddingLeft={1}
          paddingRight={2}
          borderColor={
            index === selectedControlIndex && isFocused ? 'yellow' : 'white'
          }
        >
          <Text>{control.label}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default PlaybackControls;
