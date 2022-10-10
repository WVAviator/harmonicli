export interface VolumeControl {
  currentVolume: number;
  setVolume: (volume: number) => void;
}
