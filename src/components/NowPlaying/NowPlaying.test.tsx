import { render } from 'ink-testing-library';
import React from 'react';
import { MockBrowserSession } from '../../sessions/testing/MockBrowserSession';
import removeANSI from '../../testing_utils/removeANSI';
import BrowserSessionProvider from '../BrowserSessionProvider/BrowserSessionProvider';
import NowPlaying from './NowPlaying';

describe('NowPlaying', () => {
  const mockSession = MockBrowserSession.create();
  mockSession.updateCurrentSong({
    song: 'ABC',
    artist: 'DEF',
    duration: 120,
  });

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
    const mockSession = MockBrowserSession.create();
    mockSession.updateCurrentSong({
      song: 'ABC',
      artist: 'DEF',
      duration: 120,
    });

    const { unmount, frames } = render(
      <BrowserSessionProvider value={mockSession}>
        <NowPlaying />
      </BrowserSessionProvider>
    );

    expect(removeANSI(frames[0])).toContain('ABC | DEF');
    unmount();
  });

  it('should rerender when the song updates', async () => {
    const mockSession = MockBrowserSession.create();

    mockSession.updateCurrentSong({
      song: 'ABC',
      artist: 'DEF',
      duration: 120,
    });

    const { unmount, frames } = render(
      <BrowserSessionProvider value={mockSession}>
        <NowPlaying />
      </BrowserSessionProvider>
    );

    expect(removeANSI(frames[0])).toContain('ABC | DEF');

    await new Promise((res) => setTimeout(res, 100));

    mockSession.updateCurrentSong({
      song: 'HJK',
      artist: 'LMN',
      duration: 120,
    });

    expect(removeANSI(frames[1])).toContain('HJK | LMN');

    unmount();
  });
});
