import React from 'react';
import { Text, TextProps } from 'ink';
import { useEffect, useState } from 'react';

interface MarqueeTextProps extends TextProps {
  /**
   * The text you wish to display in the terminal marquee-style.
   */
  children: string;
  /**
   * The width of the final string that will be displayed at any given time. If the string is longer than maxWidth, the marquee will scroll to display the remaining text.
   */
  maxWidth?: number;
  /**
   * The speed, in characters per second, that the marquee will scroll.
   */
  speed?: number;
  /**
   * The time in milliseconds that the start of the string will display before starting to scroll.
   */
  preDelay?: number;
  /**
   * The time in milliseconds that the end of the string will display before resetting back to the start.
   */
  postDelay?: number;
}

/**
 * Displays Ink Text with a limited width and a marquee-style scrolling effect.
 */
const MarqueeText: React.FC<MarqueeTextProps> = ({
  children,
  maxWidth = 50,
  speed = 4,
  preDelay = 3000,
  postDelay = 3000,
  ...rest
}) => {
  const [startChar, setStartChar] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let preTimeout: NodeJS.Timeout;
    let postTimeout: NodeJS.Timeout;

    const initiateStart = () => {
      setStartChar(0);
      preTimeout = setTimeout(() => initiateInterval(), preDelay);
    };

    const initiateInterval = () => {
      interval = setInterval(() => {
        setStartChar((startChar) => {
          if (startChar < children.length - maxWidth) {
            return startChar + 1;
          }
          clearInterval(interval);
          initiateEnd();
          return startChar;
        });
      }, 1000 / speed);
    };

    const initiateEnd = () => {
      postTimeout = setTimeout(() => initiateStart(), postDelay);
    };

    initiateStart();

    return () => {
      clearInterval(interval);
      clearTimeout(preTimeout);
      clearTimeout(postTimeout);
    };
  }, [children, maxWidth, speed, preDelay, postDelay]);

  const truncatedText = children.slice(startChar, startChar + maxWidth);

  return <Text {...rest}>{truncatedText}</Text>;
};

export default MarqueeText;
