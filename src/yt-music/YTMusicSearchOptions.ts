export interface YTSearchOptions {
  /**
   * When set to true, the first search result will automatically be activated. Similar to Google's "I'm feeling lucky" button. Default is true.
   */
  activateFirstResult: boolean;
}

export const defaultYTSearchOptions: YTSearchOptions = {
  activateFirstResult: true,
};

/**
 * Merges any passed in YTSearchOptions with the default, overriding any default options.
 * @param ytSearchOptions A partial object containing the default properties that should be overriden.
 * @returns An updated complete YTSearchOptions object with all properties assigned.
 */
export const mergeDefaultYTSearchOptions = (
  ytSearchOptions?: Partial<YTSearchOptions>
): YTSearchOptions => {
  return Object.assign(defaultYTSearchOptions, ytSearchOptions);
};
