import fs from 'fs';
import util from 'util';

export const logOutput = (file: string) => {
  const log_file = fs.createWriteStream(`${__dirname}/${file}`, { flags: 'w' });
  const log_stdout = process.stdout;

  console.log = function (...args: string[]) {
    const logStr = args.join(' ');
    log_file.write(util.format(logStr) + '\n');
    log_stdout.write(util.format(logStr) + '\n');
  };

  console.error = console.log;
};
