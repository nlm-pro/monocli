import { dirname, join, resolve } from "path";
import * as fs from "fs-extra";
import { silly } from "npmlog";
import { findUp, cwd } from "../utils/fs";
import { Repository } from "./git";
import { Config, SubProjectConfig } from "./config";
import { MonorepoError } from "./errors";

export class Monorepo {
  static CONFIG_FILE_NAME = `monocli.json`;

  readonly repository: Repository;

  readonly root: { path: string; configExist: boolean };

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
    const possibleConfigFilePath = findUp(Monorepo.CONFIG_FILE_NAME, cwd());
    if (possibleConfigFilePath === null) {
      const possibleGitRoot = findUp(`.git`, cwd());
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

  async updateProjectConfig(
    key: keyof SubProjectConfig,
    oldValue: string,
    newValue: string
  ): Promise<void> {
    const config = this.getConfig();
    const index = config.projects.findIndex(
      project => project[key] === oldValue
    );
    config.projects[index][key] = newValue;

    await this.saveConfig(config);
  }

  private async saveConfig(config: Config): Promise<void> {
    await fs.writeFile(
      resolve(this.root.path, Monorepo.CONFIG_FILE_NAME),
      JSON.stringify(config, null, `  `)
    );
  }

  private getOrInitConfigFilePath(): string {
    silly(`monorepo root`, this.root.path);
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
