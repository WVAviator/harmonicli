import { Actions } from './PromptChoice';

export interface PlaybackControls {
  execute: (control: any) => Promise<void>;
  controlActions: Actions[];
}
