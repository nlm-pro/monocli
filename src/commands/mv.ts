import { existsSync, pathExists } from "fs-extra";
import { notice, silly } from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { relativeTo, absolute } from "../utils/path";
import {
  RunConditionError,
  CommandOptionError,
  ConfigError
} from "../models/errors";
import { getProject } from "../utils/config";
import { SubProjectConfig } from "../models/config";
import { Monorepo } from "../models/monorepo";
import { runCommand } from "../utils/command";

export class MvCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `mv`,
    usage: `<path> <new-path>`,
    description: `change a subtree prefix`,
    details: `This command requires that <path> is associated with a existing project.

⚠️  Experimental command  ⚠️
  `,
    // TODO
    options: new Map()
  };

  async run([path, destination]: [string, string]): Promise<string | void> {
    // TODO: doc and move to Command
    if (!path || !destination) {
      throw new CommandOptionError(
        `parameters`,
        `missing parameter: ${this.doc.usage}`
      );
    }
    if (!existsSync(absolute(path))) {
      throw new CommandOptionError(
        `path`,
        `${absolute(path)} directory does not exist`
      );
    }

    silly(`path`, path);
    const oldDir = relativeTo(path, this.monorepo.root.path);
    silly(`old directory`, oldDir);
    const newDir = relativeTo(destination, this.monorepo.root.path);
    silly(`new directory`, newDir);

    if (await pathExists(absolute(destination))) {
      throw new RunConditionError(`the destination directory already exists`);
    }

    // Get project config

    let projectConfig: SubProjectConfig | null = null;
    try {
      const config = this.monorepo.getConfig();
      projectConfig = getProject(config, `directory`, oldDir);
    } catch (e) {
      notice(``, `no project config available for ${oldDir}`);
    }
    silly(`config`, `project: %s`, projectConfig);

    if (!projectConfig?.scope) {
      throw new ConfigError(`no scope found for project ${oldDir}`);
    }

    // Move files in monorepo

    const mvBranch = `monocli-mv-${projectConfig.scope}`;
    await this.monorepo.repository.git(`checkout`, [`-b`, mvBranch]);

    await this.monorepo.repository.git(`mv`, [oldDir, newDir]);
    notice(``, `files moved`);

    // Update config
    await this.monorepo.updateProjectConfig(`directory`, oldDir, newDir);
    await this.monorepo.repository.git(`add`, [Monorepo.CONFIG_FILE_NAME]);

    await this.monorepo.repository.git(`commit`, [
      `-m`,
      `build: mv ${projectConfig.scope} via monocli
    
update project directory in monocli config after mv
from ${oldDir} to ${newDir}`
    ]);

    notice(``, `commit files renaming`);
    notice(``, `commit config update`);

    if (!projectConfig?.url) {
      notice(``, `no remote url in this project config`);

      return;
    }

    // Update subtree
    await this.monorepo.repository.git(`subtree`, [
      `split`,
      `--prefix=${newDir}`,
      `--rejoin`,
      `HEAD`
    ]);
    await this.monorepo.repository.git(`subtree`, [
      `pull`,
      `--prefix=${newDir}`,
      projectConfig.url,
      `master`,
      `--squash`
    ]);

    notice(``, `subtree successfully updated`);

    // Update subtree remote repository

    await runCommand(`spush`, [newDir, projectConfig.url]);
  }
}
