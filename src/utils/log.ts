// See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27396#discussion_r204196321
// eslint-disable-next-line quotes
import log = require("npmlog");

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

export function init(level: LogLevels): void {
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
