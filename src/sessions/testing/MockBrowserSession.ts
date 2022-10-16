import { BrowserSession } from '../base/BrowserSession';
import { PlaybackControls } from '../base/PlaybackControls';
import { PlayUpdates } from '../base/PlayUpdates';
import { ProgressUpdate } from '../base/ProgressUpdate';
import { SearchHandler } from '../base/SearchHandler';
import { VolumeControl } from '../base/VolumeControl';
import { MockPlayUpdates } from './MockPlayUpdates';

export class MockBrowserSession implements BrowserSession {
  search: (args: string[]) => Promise<void>;
  PlaybackControls: PlaybackControls = {
    controlActions: [
      { label: '⏮', value: jest.fn },
      { label: '⏯', value: jest.fn },
      { label: '⏭', value: jest.fn },
    ],
  };
  PlayUpdates = new MockPlayUpdates();
  ProgressUpdates: ProgressUpdate = {
    currentProgress: {
      currentTime: 5,
      currentDuration: 10,
    },
    subscribe: jest.fn((callback) => '12345'),
    unsubscribe: jest.fn,
    forceProgressUpdate: jest.fn,
  };
  SearchHandler: SearchHandler = {
    songList: [
      {
        title: 'Old Town Road',
        artist: 'Lil Nas X',
        duration: '3:28',
        playID: '12345',
      },
    ],
    play: jest.fn,
    search: jest.fn,
    subscribe: jest.fn((callback) => '12345'),
    unsubscribe: jest.fn,
  };
  VolumeControl: VolumeControl = {
    currentVolume: 0.8,
    setVolume: jest.fn,
  };
  close: () => Promise<void>;
}
