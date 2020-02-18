import * as program from "commander";
import { Logger } from "./logger";

// FIXME: clazz type
export function commandRunner(clazz: any) {
  return async (...args: any[]): Promise<void> => {
    const log = new Logger(program.debug ? `debug` : `info`, console.log);
    const cmd = new clazz(log);
    await cmd.run(...args);
  };
}
