#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { Command, OptionValues } from 'commander';
import { App } from './App';
import { YTMusicSession } from './yt-music/YTMusicSession';

const program = new Command ();

program
  .name('music-browser-cli')
  .description('Utility for headlessly browsing and listening to music.')
  .version('0.0.1')
  .option(
    '--no-headless',
    'Setting this flag will open up the background chromium browser instance for testing/inspection.',
    true
  )
  .parse(process.argv);

const options: OptionValues = program.opts();

YTMusicSession.create(program.args, options).then(session => render(<App session={session}/>));

// render(<App session={}/>);