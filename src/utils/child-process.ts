import {
  spawn as asyncSpawn,
  PromisifySpawnOptions
} from "promisify-child-process";
import * as log from "npmlog";

export type SpawnModes = `silent` | `explain` | `show` | `dry`;

let shouldRun: boolean;

export function setDryMode(dry: boolean): void {
  shouldRun = !dry;
}

setDryMode(false);

export interface SpawnOutput {
  stdout: string;
  stderr: string;
}

export async function spawn(
  command: string,
  args: string[] = [],
  options: PromisifySpawnOptions = {},
  description?: string,
  dry = false
): Promise<SpawnOutput> {
  if (description) {
    // FIXME: use log level instead
    log.explain(command, description);
  }

  if (options.cwd) {
    log.run(`in`, options.cwd);
  }

  log.run(``, [command, ...args].join(` `));

  let rslt: SpawnOutput = { stdout: ``, stderr: `` };

  if (dry || shouldRun) {
    let { stdout, stderr } = await asyncSpawn(command, args, options);

    if (stdout instanceof Buffer) {
      stdout = stdout.toString(`utf8`);
    }

    if (stderr instanceof Buffer) {
      stderr = stderr.toString(`utf8`);
    }

    rslt = {
      stdout: stdout?.trim() || ``,
      stderr: stderr?.trim() || ``
    };

    log.output(command, rslt.stdout);
  }

  return rslt;
}
