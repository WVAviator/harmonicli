export interface YTSearchOptions {
  activateFirstResult: boolean;
}

export const defaultYTSearchOptions: YTSearchOptions = {
  activateFirstResult: true,
};

export const mergeDefaultYTSearchOptions = (
  ytSearchOptions?: Partial<YTSearchOptions>
): YTSearchOptions => {
  return Object.assign(defaultYTSearchOptions, ytSearchOptions);
};
