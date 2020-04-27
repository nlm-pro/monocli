import * as path from "path";
import * as fs from "fs-extra";
import { spawn } from "promisify-child-process";
import * as log from "npmlog";
import { absolute } from "../utils/path";
import { GitError } from "./errors";

export const GitCommands: { [s: string]: (...args: string[]) => string } = {
  goToNewBranch: branchName => `checkout -b ${branchName}`,
  status: () => `status`
};

export interface Submodule {
  name: string;
  url: string;
}

export class Repository {
  private absolutePath: string;

  constructor(pathFromCwd?: string) {
    this.absolutePath = pathFromCwd
      ? absolute(pathFromCwd)
      : path.resolve(`/tmp`, `monocli`, `${+new Date()}`);
    if (!pathFromCwd) {
      fs.ensureDirSync(this.absolutePath);
    }
  }

  get path(): string {
    return this.absolutePath;
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
        stderr instanceof Buffer
          ? stderr.toString(`utf8`)
          : typeof stderr === `string`
          ? stderr.trim()
          : `Error: git command failed`;
      throw new GitError(msg, code);
    }
  }

  async getSubmodules(): Promise<Map<string, Submodule>> {
    const regex = /^submodule\.([\w-/\\]+)\.(?:path|url) (.*)$/gm;

    let paths;

    try {
      const pathsOutput = await this.git(`config`, [
        `-f`,
        `.gitmodules`,
        `--get-regexp`,
        `submodule.*.path`
      ]);

      paths = pathsOutput.matchAll(regex);
    } catch (e) {
      log.silly(`git`, `no submodule found in ${this.path}`);
      log.silly(`error`, e);
    }

    if (!paths) {
      return new Map();
    }

    const pathsByName: Map<string, string> = new Map();
    for (const [, name, path] of paths) {
      pathsByName.set(name, path);
    }

    const urlsOutput = await this.git(`config`, [
      `-f`,
      `.gitmodules`,
      `--get-regexp`,
      `submodule.*.url`
    ]);

    const urls = urlsOutput.matchAll(regex);

    if (!urls) {
      return new Map();
    }

    const submodules: Map<string, Submodule> = new Map();
    for (const [, name, url] of urls) {
      const path = pathsByName.get(name);
      if (!path) {
        continue;
      }
      submodules.set(path, { name, url });
    }

    return submodules;
  }

  async deleteSubmodule(directory: string): Promise<void> {
    await this.git(`submodule`, [`deinit`, directory]);
    await this.git(`rm`, [directory]);
    await this.git(`commit`, [`-m`, `chore: delete submodule at ${directory}`]);
    await fs.remove(path.join(this.absolutePath, `.git/modules/`, directory));
  }
}
