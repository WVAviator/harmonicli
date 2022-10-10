export type Progress = {
  currentTime: number;
  currentDuration: number;
};

export type ProgressUpdateSubscriber = (currentProgress: Progress) => void;

export interface ProgressUpdate {
  currentProgress: Progress;
  subscribe: (callback: ProgressUpdateSubscriber) => string;
  unsubscribe: (subscriberId: string) => void;
  forceProgressUpdate: () => void;
}
