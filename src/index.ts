#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
program
  .name('music-browser-cli')
  .description('Utility for headlessly browsing and listening to music.')
  .version('0.0.1')
  .parse(process.argv);

console.log(program.args.join('+'));
