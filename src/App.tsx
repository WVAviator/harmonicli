import React, { useEffect, useState } from 'react';
import UserControls from './user-controls/UserControls';
import { YTMusicSession } from './yt-music/YTMusicSession';
import BrowserSessionProvider from './BrowserSessionProvider';
import { SessionOptions } from './user-controls/SessionOptions';
import { Text } from 'ink';

interface AppProps {
  args?: string[];
  options?: Partial<SessionOptions>;
}

export const App: React.FC<AppProps> = ({ args = [], options = {} }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log('Establishing session...');
    const establishSession = async () => {
      //TODO: Un-hardcode YTMusicSession here so that SpotifySessions can be instantated as well.
      const newSession = await YTMusicSession.create(args, options);
      setSession(newSession);
    };

    establishSession();
    return () => {
      console.log('Terminating session...');
      const terminateSession = async () => {
        await session.close();
        setSession(null);
      };
      terminateSession();
    };
  }, []);

  return (
    <BrowserSessionProvider value={session}>
      {session ? <UserControls /> : <Text>Loading...</Text>}
    </BrowserSessionProvider>
  );
};
