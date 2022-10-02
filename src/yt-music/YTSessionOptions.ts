export interface YTSessionOptions {
  headless: boolean;
}

export const defaultYTSessionOptions: YTSessionOptions = {
  headless: true,
};

export const mergeDefaultYTSessionOptions = (
  sessionOptions: Partial<YTSessionOptions>
): YTSessionOptions => {
  return Object.assign(defaultYTSessionOptions, sessionOptions);
};
