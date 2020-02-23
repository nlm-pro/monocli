import { dirname, join } from "path";
import * as fs from "fs-extra";
import { findUp } from "../utils/path";
import { Repository } from "../utils/git";
import { Config } from "./Config";

export class MonorepoError extends Error {}

export class Monorepo {
  static CONFIG_FILE_NAME = `monocli.json`;

  readonly repository: Repository;

  private readonly root: { path: string; configExist: boolean };

  constructor() {
    this.root = this.getRoot();
    this.repository = new Repository(this.root.path);
  }

  getConfig(): Config {
    const filePath = this.getOrInitConfigFilePath();
    const configContent = fs.readFileSync(filePath, { encoding: `utf-8` });

    return JSON.parse(configContent);
  }

  getRoot(): { path: string; configExist: boolean } {
    let configFilePath: string;
    let configExist = false;
    const possibleConfigFilePath = findUp(
      Monorepo.CONFIG_FILE_NAME,
      process.cwd()
    );
    if (possibleConfigFilePath === null) {
      const possibleGitRoot = findUp(`.git`, process.cwd());
      if (possibleGitRoot === null) {
        throw new MonorepoError(
          `not a monocli nor a git repository (or any parent up to mount point /)`
        );
      }
      configFilePath = join(
        dirname(possibleGitRoot),
        Monorepo.CONFIG_FILE_NAME
      );
    } else {
      configFilePath = possibleConfigFilePath;
      configExist = true;
    }

    return { path: dirname(configFilePath), configExist };
  }

  private getOrInitConfigFilePath(): string {
    const configFilePath = join(this.root.path, Monorepo.CONFIG_FILE_NAME);
    if (!this.root.configExist) {
      fs.writeFileSync(
        configFilePath,
        JSON.stringify({ projects: [] }, null, `  `),
        { encoding: `utf-8` }
      );
    }

    return configFilePath;
  }
}
