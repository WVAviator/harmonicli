import fs from 'fs';

interface LoggerOptions {
  sessionPrefix: string;
  logPrefix: string;
  outputDirectory: string;
}

export class Logger {
  private _options: LoggerOptions = {
    sessionPrefix: `\n\n\nSession: ${new Date().toISOString()} ----------\n\n`,
    logPrefix: `${new Date().toISOString()}: `,
    outputDirectory: `${__dirname}/debug.log`,
  };
  private _logListeners: Set<(logOutput: string) => void> = new Set();
  private _logFile: fs.WriteStream;

  constructor(options?: Partial<LoggerOptions>) {
    this._options = Object.assign(this._options, options);
    this._logFile = fs.createWriteStream(this._options.outputDirectory, {
      flags: 'a',
    });

    this._logFile.write(this._options.sessionPrefix);
    const fileLogger = (logOutput: string) => {
      this._logFile.write(logOutput);
    };
    this.addListener(fileLogger);

    this.hookConsole();
  }

  public addListener(callback: (logOutput: string) => void) {
    this._logListeners.add(callback);
  }

  public removeListener(callback: (logOutput: string) => void) {
    this._logListeners.delete(callback);
  }

  private hookConsole() {
    // const hookStream = (
    //   stream: NodeJS.WriteStream,
    //   fn: (buffer: string) => boolean
    // ) => {
    //   var oldWrite = stream.write;
    //   stream.write = fn;

    //   return () => {
    //     stream.write = oldWrite;
    //   };
    // };

    // const consoleHook = (buffer: string) => {
    //   const outputLog = `${this._options.logPrefix}${buffer}`;
    //   this._logListeners.forEach((listener) => listener(outputLog));
    //   return true;
    // };

    // hookStream(process.stdout, consoleHook);
    // hookStream(process.stderr, consoleHook);

    console.log = (...data: string[]) => {
      const outputLog = `${this._options.logPrefix}${data.join(' ')}\n`;
      this._logListeners.forEach((listener) => listener(outputLog));
    };

    console.error = (data: Error) => {
      const outputLog = `${this._options.logPrefix}${data.stack}\n`;
      this._logListeners.forEach((listener) => listener(outputLog));
    };
  }
}
