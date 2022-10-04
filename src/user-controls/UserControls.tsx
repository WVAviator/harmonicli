import { BrowserSession } from './BrowserSession';
import React, { useContext, useEffect, useState } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { BrowserSessionContext } from '../BrowserSessionProvider';

const UserControls = () => {
  // session: BrowserSession;

  // constructor(props) {
  //   super (props);

  //   this.session = props.session;

  //   this.state = {
  //     nowPlaying: this.session.PlayUpdates.nowPlaying,
  //   }

  //   this.session.PlayUpdates.subscribe((song) => {
  //     this.updateSongTitle(song);
  //   });

  // }

  // async updateSongTitle(song: string) {
  //   this.setState({
  //     nowPlaying: song,
  //   })
  // }

  // getChoices() {
  //   return [...this.session.PlaybackControls.controlActions];
  // }

  // handleAction (action) {
  //   action.value();
  // }
  console.log('Rendering UserControls');

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
      <Text>Test</Text>
      <SelectInput
        items={session.PlaybackControls.controlActions}
        onSelect={(item) => item.value()}
      ></SelectInput>
    </>
  );
};

export default UserControls;
