import React from 'react';
import { Text, TextProps } from 'ink';

interface ProgressBarProps extends TextProps {
  percent: number;
  width?: number | `${number}%`;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  width = '100%',
  ...rest
}) => {
  const maxWidth =
    typeof width === 'number' ? width : +width.slice(0, width.length - 1);

  const bar = '█'.repeat(Math.floor(maxWidth * percent));

  return <Text {...rest}>{bar}</Text>;
};

export default ProgressBar;
