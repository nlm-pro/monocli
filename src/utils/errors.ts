import * as log from "npmlog";
import { MonorepoError } from "../models/Monorepo";
import { GitError } from "./git";
import { BuildCommandError } from "./command";
import { debugOutput, lineBreak } from "./output";

export function errorsGlobalHandler(e: Error): void {
  lineBreak();
  log.silly(`error from`, e.constructor.name.replace(`Error`, ``));
  if (e instanceof GitError) {
    log.error(`git (${e.code})`, e.message);
  } else if (e instanceof MonorepoError) {
    log.error(`monorepo`, e.message);
  } else if (e instanceof BuildCommandError) {
    log.error(e.cmdName, e.message);
    // TODO: output global help
  } else {
    log.error(``, e.message);
  }

  lineBreak();
  if (e.stack) {
    debugOutput(e.stack);
  }
}
