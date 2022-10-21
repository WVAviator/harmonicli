import { Box, Text } from 'ink';
import React, { useContext, useEffect, useState } from 'react';
import { LogContext } from '../LogProvider/LogProvider';

const LogOutputWindow: React.FC = () => {
  const logger = useContext(LogContext);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleLog = (logOutput: string) => {
      setLogs((logs) => [...logs, logOutput]);
    };
    logger.addListener(handleLog);
    () => {
      logger.removeListener(handleLog);
    };
  }, [logger]);

  return (
    <Box borderStyle="round" minHeight={7}>
      <Text>
        {logs.slice(logs.length - 6).map((log) => {
          return log + '\n';
        })}
      </Text>
    </Box>
  );
};

export default LogOutputWindow;
