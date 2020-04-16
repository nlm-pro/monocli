import { Writable } from "stream";
import { errorsGlobalHandler } from "./utils/errors";
import { MainCommand } from "./models/main-command";
import { parse } from "./utils/parse";
import * as Logging from "./utils/log";
import { chdir } from "./utils/path";

export async function run(
  argv: string[],
  directory?: string,
  stream?: Writable
): Promise<void> {
  try {
    chdir(directory || process.cwd());
    const args = parse(argv);
    Logging.init(args[1].get(`debug`) ? `silly` : `notice`, stream);

    const main = new MainCommand();
    await main.run(...args);
  } catch (e) {
    errorsGlobalHandler(e);
  }
}
