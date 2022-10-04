import { BrowserSession } from './BrowserSession';
import React from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';

export class UserControls extends React.Component {
  session: BrowserSession;

  constructor(props) {
    super (props);

    this.session = props.session;

    this.state = {
      nowPlaying: this.session.PlayUpdates.nowPlaying,
    }
    
    this.session.PlayUpdates.subscribe((song) => {
      this.updateSongTitle(song);
    });

  }

  async updateSongTitle(song: string) {
    this.setState({
      nowPlaying: song,
    })
  }

  getChoices() {
    return [...this.session.PlaybackControls.controlActions];
  }

  handleAction (action) {
    action.value();
  }

  render () {
    return (
      <>
        {/* <Text>{this.state.nowPlaying}</Text> */}
        <Text>Test</Text>
        <SelectInput items={this.getChoices()} onSelect={this.handleAction}></SelectInput>
      </>
    )
  }
}