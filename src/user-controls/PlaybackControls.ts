export interface PlaybackActions {
  /**
   * The text to display for manipulating this control.
   */
  label: string;
  /**
   * A function that activates this control.
   */
  value: () => void;
}
/**
 * An abstract interface to be implemented by a class that provides the means to manipulate playback controls in the session.
 */
export interface PlaybackControls {
  execute: (control: any) => Promise<void>;
  controlActions: PlaybackActions[];
}
