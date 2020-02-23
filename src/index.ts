// TODO: remove minimist
import * as log from "npmlog";
import { errorsGlobalHandler } from "./utils/errors";
import { MainCommand } from "./models/main-command";
import { parse } from "./utils/parse";
import * as Logging from "./utils/log";

log.pause();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  try {
    const args = parse(process.argv.slice(2));
    Logging.init(args[1].get(`debug`) ? `silly` : `notice`);
    log.resume();

    const main = new MainCommand();
    await main.run(...args);
  } catch (e) {
    errorsGlobalHandler(e);
  }
})();
