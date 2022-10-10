import { VolumeControl } from './VolumeControl';
import { ProgressUpdate } from '../progress-bar/ProgressUpdate';
import { PlaybackControls } from './PlaybackControls';
import { PlayUpdates } from './PlayUpdates';
import { SearchHandler } from './SearchHandler';

export interface BrowserSession {
  search: (args: string[]) => Promise<void>;
  PlaybackControls: PlaybackControls;
  PlayUpdates: PlayUpdates;
  ProgressUpdates: ProgressUpdate;
  SearchHandler: SearchHandler;
  VolumeControl: VolumeControl;
  close: () => Promise<void>;
}
