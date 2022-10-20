#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { App } from './App';
import { Logger } from './utilities/logging/Logger';

const program = new Command();

program
  .name('music-browser-cli')
  .description('Utility for headlessly browsing and listening to music.')
  .version('0.0.1')
  .option(
    '--no-headless',
    'Setting this flag will open up the background chromium browser instance for testing/inspection.',
    true
  )
  .option(
    '--debug',
    'Setting this flag will enable debug logs out to the console.',
    false
  )
  .parse(process.argv);

const options = program.opts();

const logger = new Logger();

render(
  <App
    logger={logger}
    sessionOptions={{
      args: program.args,
      headless: !!options.headless,
    }}
    debug={options.debug}
  />,
  {
    patchConsole: false,
  }
);

// render(<App session={}/>);
