import React, { createContext } from 'react';
import { BrowserSession } from '../../sessions/base/BrowserSession';

interface BrowserSessionProviderProps {
  /**
   * The session that will be provided as context to all wrapped children.
   */
  value: BrowserSession;
  children: React.ReactNode;
}

/**
 * The current context for BrowserSessions to be used in useContext().
 */
export const BrowserSessionContext = createContext<BrowserSession>(null);

/**
 * Used to provide a BrowserSessionContext to any nested components.
 */
const BrowserSessionProvider: React.FC<BrowserSessionProviderProps> = ({
  value,
  children,
}) => {
  return (
    <BrowserSessionContext.Provider value={value}>
      {children}
    </BrowserSessionContext.Provider>
  );
};

export default BrowserSessionProvider;
