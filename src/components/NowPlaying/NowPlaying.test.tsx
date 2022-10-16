import { render } from 'ink-testing-library';
import React from 'react';
import { MockBrowserSession } from '../../sessions/testing/MockBrowserSession';
import removeANSI from '../../testing_utils/removeANSI';
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

  it('should display the currently playing song by default', () => {
    const mockSession = new MockBrowserSession();
    mockSession.PlayUpdates.nowPlaying = 'Test';

    const { unmount, frames } = render(
      <BrowserSessionProvider value={mockSession}>
        <NowPlaying />
      </BrowserSessionProvider>
    );

    expect(removeANSI(frames[0]).includes('Test')).toBe(true);
    unmount();
  });
});
