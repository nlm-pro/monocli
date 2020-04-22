import { Writable, Readable } from "stream";
import { errorsGlobalHandler } from "./utils/errors";
import { MainCommand } from "./models/main-command";
import { parse } from "./utils/parse";
import * as Logging from "./utils/log";
import { chdir } from "./utils/fs";
import { setPrompter, getPrompter } from "./utils/prompt";

export async function run(
  argv: string[],
  directory?: string,
  output?: Writable,
  input?: Readable
): Promise<void> {
  try {
    chdir(directory || process.cwd());
    const args = parse(argv);
    Logging.init(args[1].get(`debug`) ? `silly` : `notice`, output);
    setPrompter(input, output);

    const main = new MainCommand();
    await main.run(...args);
  } catch (e) {
    errorsGlobalHandler(e);
  } finally {
    getPrompter().close();
  }
}
