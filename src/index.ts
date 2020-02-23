import * as log from "npmlog";
import * as Logging from "./utils/log";
import { buildCommand } from "./utils/command";
import { errorsGlobalHandler } from "./utils/errors";

log.pause();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  try {
    const options = process.argv.slice(2);

    // TODO: parse options
    const debug = options.includes(`--debug`);

    Logging.init(debug ? `silly` : `notice`);
    log.resume();

    const command = buildCommand(options[0]);

    await command.run();
  } catch (e) {
    errorsGlobalHandler(e);
  }
})();
