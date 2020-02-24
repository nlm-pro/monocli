import { resolve } from "path";
import { spawn } from "promisify-child-process";
import * as log from "npmlog";
import { GitError } from "./errors";

export const GitCommands: { [s: string]: (...args: string[]) => string } = {
  goToNewBranch: branchName => `checkout -b ${branchName}`,
  status: () => `status`
};

export class Repository {
  private absolutePath: string;

  constructor(pathFromCwd: string) {
    this.absolutePath = resolve(process.cwd(), pathFromCwd);
  }

  async git(command: string, args: string[] = []): Promise<string> {
    const cmdString = [`git`, command, ...args].join(` `);
    log.git(`run`, cmdString);
    try {
      const { stdout } = await spawn(`git`, [command, ...args], {
        encoding: `utf8`,
        cwd: this.absolutePath
      });
      if (typeof stdout === `string` && stdout) {
        return stdout.trim();
      }

      log.silly(`git`, `unhandled buffer result`);

      return ``;
    } catch ({ stderr, code }) {
      const msg =
        typeof stderr === `string`
          ? stderr.split(`\n`)[0].trim()
          : `Error: git command failed`;
      throw new GitError(msg, code);
    }
  }
}
