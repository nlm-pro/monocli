import * as log from "npmlog";
import { Repository, GitError } from "./utils/git";
import { init } from "./utils/log";
import { debugOutput } from "./utils/output";

init(`silly`);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  try {
    const repo = new Repository(`.`);
    await repo.status();
  } catch (e) {
    if (e instanceof GitError) {
      log.error(`git (${e.code})`, e.message);
      if (e.stack) {
        debugOutput(e.stack);
      }
    }
  }
})();
