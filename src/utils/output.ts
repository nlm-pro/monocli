import * as log from "npmlog";
import { debug } from "./log";

/**
 * output to stdout in a progress bar compatible way
 *
 * @author npm, Inc. and Contributors
 * @see https://github.com/npm/cli/blob/b829d62c98506325d2afb2d85d191a8ff1c49157/lib/utils/output.js
 */

export function output(...args: any[]): void {
  log.clearProgress();
  // eslint-disable-next-line no-console
  console.log(...args);
  log.showProgress();
}

export function debugOutput(...args: any[]): void {
  if (debug) {
    output(...args);
  }
}
