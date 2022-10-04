import React, { FC, useEffect, useState } from 'react';
import { UserControls } from './user-controls/UserControls';
import { YTMusicSession } from './yt-music/YTMusicSession';
import { BrowserSession } from './user-controls/BrowserSession';

async function createSession(args, options) {
    const session = useState(await YTMusicSession.create(args, options))
    return session || null;
}

export const App: FC<{session: BrowserSession}> = function ({session}) {
    return (
        // @ts-ignore
        <UserControls session={session}/>
    );
}