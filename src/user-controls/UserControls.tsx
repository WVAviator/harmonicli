import React, { useContext } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { BrowserSessionContext } from '../BrowserSessionProvider';
import useNowPlaying from '../hooks/useNowPlaying';

const UserControls = () => {
  const session = useContext(BrowserSessionContext);
  const nowPlaying = useNowPlaying();

  return (
    <>
      <Text>{nowPlaying}</Text>
      <SelectInput
        items={session.PlaybackControls.controlActions}
        onSelect={(item) => item.value()}
      ></SelectInput>
    </>
  );
};

export default UserControls;
