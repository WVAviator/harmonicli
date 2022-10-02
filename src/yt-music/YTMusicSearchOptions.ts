export interface YTSearchOptions {
  activateFirstResult: boolean;
}

export const defaultYTSearchOptions: YTSearchOptions = {
  activateFirstResult: true,
};

export const mergeDefaultYTSearchOptions = (
  ytSearchOptions?: Partial<YTSearchOptions>
) => {
  ytSearchOptions = Object.assign(defaultYTSearchOptions, ytSearchOptions);
};
