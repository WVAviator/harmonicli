/**
 * Converts a number representing seconds into a time string with both minutes and seconds.
 * @param time The time in seconds
 * @returns A string formatted with minutes and seconds, e.g. 5:34
 */
export const getFormattedTimeString = (time: number | string) => {
  if (typeof time === 'string') return time;
  if (time === NaN) return '0:00';

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minutesString = minutes.toString();
  const secondsString = `${seconds < 10 ? '0' : ''}${seconds.toString()}`;

  return `${minutesString}:${secondsString}`;
};

export const getValueFromTimeString = (time: string | number) => {
  if (typeof time === 'number') return time;
  const [minutes, seconds] = time.trim().split(':');
  const result = +minutes * 60 + +seconds;
  return result;
};
