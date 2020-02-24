import * as log from "npmlog";
import { GitError, MonorepoError, CommandOptionError } from "../models/errors";
import { debugOutput, lineBreak } from "./output";

export function errorsGlobalHandler(e: Error): void {
  lineBreak();
  log.silly(`error from`, e.constructor.name.replace(`Error`, ``));
  if (e instanceof GitError) {
    log.error(`git (${e.code})`, e.message);
  } else if (e instanceof MonorepoError) {
    log.error(`monorepo`, e.message);
  } else if (e instanceof CommandOptionError) {
    if (typeof e.optionName === `string`) {
      log.error(e.optionName, e.message);
    } else {
      log.error(``, e.message);
      log.error(`options`, e.optionName.join(`, `));
    }
  } else {
    log.error(``, e.message);
  }

  lineBreak();
  if (e.stack) {
    debugOutput(e.stack);
  }
}
