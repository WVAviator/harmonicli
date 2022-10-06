import React, { useContext, useEffect, useState } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { BrowserSessionContext } from '../BrowserSessionProvider';

const UserControls = () => {
  const session = useContext(BrowserSessionContext);
  const [nowPlaying, setNowPlaying] = useState(session.PlayUpdates.nowPlaying);
  const [nowPlayingSubscriberId, setNowPlayingSubscriberId] = useState(null);

  useEffect(() => {
    const subscriberId = session.PlayUpdates.subscribe((nowPlaying) => {
      setNowPlaying(nowPlaying);
    });
    setNowPlayingSubscriberId(subscriberId);
    return () => {
      session.PlayUpdates.unsubscribe(nowPlayingSubscriberId);
    };
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
