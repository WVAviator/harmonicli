import MarqueeText from './MarqueeText';
import React from 'react';
import { render } from 'ink-testing-library';

describe('MarqueeText', () => {
  it('should render without errors', () => {
    const { lastFrame, unmount } = render(<MarqueeText>Test text</MarqueeText>);
    const renderedOutput = lastFrame();

    expect(renderedOutput).not.toBeNull;
    expect(renderedOutput).not.toEqual('');

    unmount();
  });

  it('should initially render a partial string if longer than width', () => {
    const testString = 'abcdefghijklmnopqrstuvwxyz';
    const sliceValue = 10;

    const { lastFrame, unmount } = render(
      <MarqueeText maxWidth={sliceValue}>{testString}</MarqueeText>
    );
    const renderedOutput = lastFrame();

    expect(renderedOutput).toBe(testString.slice(0, sliceValue));

    unmount();
  });

  it('should animate correctly', async () => {
    const { frames, unmount } = render(
      <MarqueeText maxWidth={3} preDelay={100} postDelay={1000} speed={5}>
        abcde
      </MarqueeText>
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(frames).toEqual(['abc', 'bcd', 'cde']);

    unmount();
  });
});
