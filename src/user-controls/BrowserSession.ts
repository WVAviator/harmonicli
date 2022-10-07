import { ProgressUpdate } from '../progress-bar/ProgressUpdate';
import { PlaybackControls } from './PlaybackControls';
import { PlayUpdates } from './PlayUpdates';

/**
 * An abstract interface to be implemented by any class that provides a session for the user interface to display and control.
 */
export interface BrowserSession {
  /**
   * This function should execute a search based on the passes in arguments.
   */
  search: (args: string[]) => Promise<void>;
  PlaybackControls: PlaybackControls;
  PlayUpdates: PlayUpdates;
  ProgressUpdates: ProgressUpdate;
  /**
   * This function should terminate the session.
   */
  close: () => Promise<void>;
}
