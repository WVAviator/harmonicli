import React, { useEffect, useState } from 'react';
import { YTMusicSession } from './yt-music/YTMusicSession';
import BrowserSessionProvider from './BrowserSessionProvider';
import { SessionOptions } from './user-controls/SessionOptions';
import { Text } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import SongProgress from './progress-bar/SongProgress';
import NowPlaying from './components/NowPlaying/NowPlaying';
import PlaybackControls from './components/PlaybackControls/PlaybackControls';
import { SearchBar } from './components/Search/SearchBar';
import VolumeControl from './components/VolumeControl/VolumeControl';

interface AppProps {
  args?: string[];
  options?: Partial<SessionOptions>;
}

export const App: React.FC<AppProps> = ({ args = [], options = {} }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const establishSession = async () => {
      //TODO: Un-hardcode YTMusicSession here so that SpotifySessions can be instantated as well.
      const newSession = await YTMusicSession.create(args, options);
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

  return (
    <BrowserSessionProvider value={session}>
      {session ? (
        <>
          <NowPlaying />
          <SongProgress />
          <PlaybackControls />
          <VolumeControl />
          <SearchBar />
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
