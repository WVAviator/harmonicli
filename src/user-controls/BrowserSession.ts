import { PlaybackControls } from './PlaybackControls';
import { PlayUpdates } from './PlayUpdates';

export interface BrowserSession {
  search: (args: string[]) => Promise<void>;
  PlaybackControls: PlaybackControls;
  PlayUpdates: PlayUpdates;
}
