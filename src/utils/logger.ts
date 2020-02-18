import * as symbols from "log-symbols";
import * as chalk from "chalk";

type LogLevel = `debug` | `info` | `warning` | `error`;
const LEVELS: LogLevel[] = [`debug`, `info`, `warning`, `error`];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogFn = (message?: any, ...optionalParams: any[]) => any;

export class Logger {
  private level: number;
  log: LogFn;

  constructor(level: LogLevel, log: LogFn) {
    this.level = LEVELS.indexOf(level);
    this.log = log;
  }

  debug(message: any): void {
    if (this.level <= 0) {
      if (typeof message === `string`) {
        this.log(chalk.gray(`[Debug] ${message}`));
      } else {
        this.log(chalk.gray(`--- Debug ---`));
        this.log(message);
        this.log(chalk.gray(`-------------`));
      }
    }
  }

  info(message: string): void {
    if (this.level <= 1) {
      this.log(symbols.info, message);
    }
  }

  warning(message: string): void {
    if (this.level <= 2) {
      this.log(symbols.warning, chalk.yellow(message));
    }
  }

  // FIXME: type
  error(message: Error | string): void {
    this.log(symbols.error, chalk.red(message));
    if (this.level <= 0) {
      if (message instanceof Error) {
        this.log(message.stack);
      }
      console.trace();
    }
  }

  success(message: string): void {
    this.log(symbols.success, chalk.green(message));
  }

  raw(...messages: string[]): void {
    this.log(...messages);
  }
}
