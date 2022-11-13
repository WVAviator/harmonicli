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
import MainMenu, { MenuButtonItem } from './components/MainMenu/MainMenu';
import LogOutputWindow from './components/LogOutputWindow/LogOutputWindow';

interface AppProps {
  sessionOptions?: Partial<SessionOptions>;
  debug?: boolean;
}

export const App: React.FC<AppProps> = ({
  sessionOptions = {},
  debug = false,
}) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const establishSession = async () => {
      //TODO: Un-hardcode YTMusicSession here so that SpotifySessions can be instantated as well.
      const newSession = await YTMusicSession.create(sessionOptions);
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

  // TODO: Find better place for MainMenu items to be decided.
  const menuItems: MenuButtonItem[] = [
    { label: 'Search 🔎', element: <SearchBar />, action: (id) =>  {} },
    { label: 'Exit 🛑', action: () => process.exit(1) },
  ];

  return (
    <BrowserSessionProvider value={session}>
      {debug && <LogOutputWindow />}
      {session ? (
        <>
          <NowPlaying />
          <SongProgress />
          <MainMenu items={menuItems} defaultChildFocused={1}>
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
