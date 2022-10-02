export interface YTSessionOptions {
  /**
   * When set to true, the Chromium browser instance running Youtube Music will be headless (not rendered). Default is true.
   */
  headless: boolean;
}

export const defaultYTSessionOptions: YTSessionOptions = {
  headless: true,
};

/**
 * Merges any passed in YTSessionOptions with the default, overriding any default options.
 * @param sessionOptions A partial object containing the default properties that should be overriden.
 * @returns An updated complete YTSessionOptions object with all properties assigned.
 */
export const mergeDefaultYTSessionOptions = (
  sessionOptions: Partial<YTSessionOptions>
): YTSessionOptions => {
  return Object.assign(defaultYTSessionOptions, sessionOptions);
};
