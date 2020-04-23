import { Writable } from "stream";
import { errorsGlobalHandler } from "./utils/errors";
import { MainCommand } from "./models/main-command";
import { parse } from "./utils/parse";
import * as Logging from "./utils/log";
import { chdir } from "./utils/fs";
import * as prompt from "./utils/prompt";

export async function run(
  argv: string[],
  directory?: string,
  output?: Writable
): Promise<void> {
  try {
    chdir(directory || process.cwd());
    const args = parse(argv);
    Logging.init(args[1].get(`debug`) ? `silly` : `notice`, output);
    prompt.setOutput(output || process.stdout);

    const main = new MainCommand();
    await main.run(...args);
  } catch (e) {
    errorsGlobalHandler(e);
  }
}
