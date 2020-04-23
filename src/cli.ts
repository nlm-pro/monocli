import { Writable } from "stream";
import { errorsGlobalHandler } from "./utils/errors";
import { MainCommand } from "./models/main-command";
import { parse } from "./utils/parse";
import { chdir } from "./utils/fs";

export async function main(
  argv: string[],
  directory?: string,
  output?: Writable
): Promise<void> {
  try {
    chdir(directory || process.cwd());
    const args = parse(argv);
    const main = new MainCommand(output);
    await main.run(...args);
  } catch (e) {
    errorsGlobalHandler(e);
  }
}
