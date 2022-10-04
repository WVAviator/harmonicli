import React, { useContext, useEffect, useState } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { BrowserSessionContext } from '../BrowserSessionProvider';

const UserControls = () => {
  const session = useContext(BrowserSessionContext);
  const [nowPlaying, setNowPlaying] = useState('');

  useEffect(() => {
    session.PlayUpdates.subscribe((nowPlaying) => {
      setNowPlaying(nowPlaying);
    });
  }, []);

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
