import React from 'react';
import { Text, TextProps } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

interface ProgressBarProps extends TextProps {
  /**
   * A number from zero to one that will render the progress bar between zero and width.
   */
  percent: number;
  /**
   * The width of the progress bar when it is full. Can be a number of characters or a percentage of the terminal width.
   * @default '100%'
   */
  width?: number | `${number}%`;
}

/**
 * This component displays a bar of text that is filled to a certain percentage. Can be styled as Ink Text.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  width = '100%',
  ...rest
}) => {
  const [columns] = useStdoutDimensions();

  const maxWidth =
    typeof width === 'number'
      ? width
      : +width.slice(0, width.length - 1) * 0.01 * columns;

  const bar = '█'.repeat(Math.floor(maxWidth * percent));

  return <Text {...rest}>{bar}</Text>;
};

export default ProgressBar;
