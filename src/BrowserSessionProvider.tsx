import React, { createContext } from 'react';
import { BrowserSession } from './user-controls/BrowserSession';

interface BrowserSessionProviderProps {
  value: BrowserSession;
  children: React.ReactNode;
}

export const BrowserSessionContext = createContext<BrowserSession>(null);

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
