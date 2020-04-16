// See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27396#discussion_r204196321
// eslint-disable-next-line quotes
import log = require("npmlog");
import { Writable } from "stream";
import { Console } from "console";

export type LogLevels =
  | `silly`
  | `verbose`
  | `info`
  | `timing`
  | `http`
  | `git`
  | `notice`
  | `warn`
  | `error`
  | `silent`;

const logLevels: Array<LogLevels> = [
  `silly`,
  `verbose`,
  `info`,
  `timing`,
  `http`,
  `git`,
  `notice`,
  `warn`,
  `error`,
  `silent`
];

export let debug = false;

let outConsole: Console = global.console;

export function init(level: LogLevels, stream?: Writable): void {
  if (stream) {
    log.stream = stream;
    outConsole = new Console(stream, stream);
  }

  log.level = level;

  const logLevel = logLevels.indexOf(level);

  if (logLevel < logLevels.indexOf(`git`)) {
    debug = true;
  }

  // Limited choice of colors
  // see https://www.npmjs.com/package/console-control-strings#var-code--consolecontrolcolor-color1--color2----colorn-
  log.addLevel(`git`, 1900, { fg: `magenta`, bg: `yellow` });
  log.heading = `monocli`;
}

/**
 * output to stdout in a progress bar compatible way
 *
 * @author npm, Inc. and Contributors
 * @see https://github.com/npm/cli/blob/b829d62c98506325d2afb2d85d191a8ff1c49157/lib/utils/output.js
 */
export function output(...args: any[]): void {
  log.clearProgress();
  outConsole.log(...args);
  log.showProgress();
}

export function debugOutput(...args: any[]): void {
  if (debug) {
    output(...args);
  }
}

export function lineBreak(): void {
  outConsole.log();
}
