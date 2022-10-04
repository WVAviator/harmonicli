import React, { FC } from 'react';
import { UserControls } from './user-controls/UserControls';
import { BrowserSession } from './user-controls/BrowserSession';

export const App: FC<{session: BrowserSession}> = function ({session}) {
    return (
        // @ts-ignore
        <UserControls session={session}/>
    );
}