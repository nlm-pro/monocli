import { dirname, resolve, join } from "path";
import * as fs from "fs-extra";
import { findUp } from "../utils/path";
import { Config } from "./Config";

export class MonorepoError extends Error {}

export class Monorepo {
  static CONFIG_FILE_NAME = `monocli.json`;

  getConfig(): Config {
    const filePath = this.getOrInitConfigFilePath();
    const configContent = fs.readFileSync(filePath, { encoding: `utf-8` });

    return JSON.parse(configContent);
  }

  private getOrInitConfigFilePath(): string {
    let configFilePath: string;
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
      fs.writeFileSync(
        configFilePath,
        JSON.stringify({ projects: [] }, null, `  `),
        { encoding: `utf-8` }
      );
      configFilePath = join(
        dirname(possibleGitRoot),
        Monorepo.CONFIG_FILE_NAME
      );
    } else {
      configFilePath = possibleConfigFilePath;
    }

    return configFilePath;
  }
}
