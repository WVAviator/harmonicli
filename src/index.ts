#!/usr/bin/env node
import { Command } from 'commander';
import { UserControls } from './user-controls/UserControls';
import { YTMusicSession } from './yt-music/YTMusicSession';

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
const headless = true && options.headless;

(async () => {
  const ytMusicSession = await YTMusicSession.create(program.args, {
    headless,
  });
  const userControls = new UserControls(ytMusicSession);
})();
