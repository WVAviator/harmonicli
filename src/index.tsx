#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { App } from './App';
import { logOutput } from './utilities/logging';

logOutput('debug.log');
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
  .parse(process.argv);

const options = program.opts();

render(<App options={{ args: program.args, headless: !!options.headless }} />);

// render(<App session={}/>);
