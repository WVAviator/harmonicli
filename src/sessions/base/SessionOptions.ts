import { OptionValues } from 'commander';

export interface SessionOptions extends OptionValues {
  /**
   * When set to true, the Chromium browser instance running Youtube Music will be headless (not rendered). Default is true.
   */
  headless: boolean;
}

export const defaultSessionOptions: SessionOptions = {
  headless: true,
};

/**
 * Merges any passed in YTSessionOptions with the default, overriding any default options.
 * @param sessionOptions A partial object containing the default properties that should be overriden.
 * @returns An updated complete YTSessionOptions object with all properties assigned.
 */
export const mergeDefaultSessionOptions = (
  sessionOptions: Partial<SessionOptions>
): SessionOptions => {
  return Object.assign(defaultSessionOptions, sessionOptions);
};
