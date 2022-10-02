export interface BrowserSession {
  search: (args: string[]) => Promise<void>;
}
