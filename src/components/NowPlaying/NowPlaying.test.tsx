import { render } from 'ink-testing-library';
import React from 'react';
import { MockBrowserSession } from '../../sessions/testing/MockBrowserSession';
import BrowserSessionProvider from '../BrowserSessionProvider/BrowserSessionProvider';
import NowPlaying from './NowPlaying';

describe('NowPlaying', () => {
  const mockSession = new MockBrowserSession();

  it('should render without errors', () => {
    expect(() => {
      const { unmount } = render(
        <BrowserSessionProvider value={mockSession}>
          <NowPlaying />
        </BrowserSessionProvider>
      );
      unmount();
    }).not.toThrowError();
  });
});
