import React, { useEffect, useState } from 'react';
import { YTMusicSession } from './sessions/yt-music/YTMusicSession';
import BrowserSessionProvider from './components/BrowserSessionProvider/BrowserSessionProvider';
import { SessionOptions } from './sessions/base/SessionOptions';
import { Text } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import SongProgress from './components/SongProgress/SongProgress';
import NowPlaying from './components/NowPlaying/NowPlaying';
import PlaybackControls from './components/PlaybackControls/PlaybackControls';
import { SearchBar } from './components/SearchBar/SearchBar';
import VolumeControl from './components/VolumeControl/VolumeControl';
import MainMenu, { Item } from './components/MainMenu/MainMenu';

interface AppProps {
  options?: Partial<SessionOptions>;
}

export const App: React.FC<AppProps> = ({ options = {} }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const establishSession = async () => {
      //TODO: Un-hardcode YTMusicSession here so that SpotifySessions can be instantated as well.
      const newSession = await YTMusicSession.create(options);
      setSession(newSession);
    };

    establishSession();
    return () => {
      const detachedSession = session;
      setSession(null);
      const terminateSession = async () => {
        await detachedSession?.close();
      };
      terminateSession();
    };
  }, []);

  const testItems: Item[] = [
    { label: 'Search 🔎', element: <SearchBar />, action: (id) =>  {} },
    { label: 'Exit 🛑', element: <></>, action: (id) =>  process.exit(1) },
  ]

  return (
    <BrowserSessionProvider value={session}>
      {session ? (
        <>
          <NowPlaying />
          <SongProgress />
          <MainMenu items={testItems}>
            <PlaybackControls />
            <VolumeControl />
          </MainMenu>
        </>
      ) : (
        <Text>
          <Gradient name="summer">
            <Text>
              <Spinner type="bouncingBall" />
            </Text>
          </Gradient>
          {' Loading'}
        </Text>
      )}
    </BrowserSessionProvider>
  );
};
