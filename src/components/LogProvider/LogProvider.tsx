import React, { createContext } from 'react';
import { Logger } from '../../utilities/logging/Logger';

interface LogProviderProps {
  /**
   * The session that will be provided as context to all wrapped children.
   */
  value: Logger;
  children: React.ReactNode;
}

/**
 * The current context for Logs to be used in useContext().
 */
export const LogContext = createContext<Logger>(null);

/**
 * Used to provide a LogContext to any nested components.
 */
const LogProvider: React.FC<LogProviderProps> = ({ value, children }) => {
  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};

export default LogProvider;
