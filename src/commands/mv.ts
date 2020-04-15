import { resolve } from "path";
import { ensureDir, existsSync } from "fs-extra";
import { notice, silly } from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { cmdOption } from "../models/options";
import { CommandDocumentation } from "../models/documentation";
import { relativeTo, absolute, isEmpty } from "../utils/path";
import {
  RunConditionError,
  CommandOptionError,
  ConfigError
} from "../models/errors";
import { getProject } from "../utils/config";
import { SubProjectConfig } from "../models/config";
import { Repository } from "../models/git";
import { Monorepo } from '../models/monorepo';

export class MvCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `mv`,
    usage: `<path> <new-path>`,
    description: `change a subtree prefix`,
    details: `This command requires that <path> is associated with a existing project with an url.
⚠️  Experimental command  ⚠️
  `,
    // TODO
    options: new Map()
  };

  async run(
    [path, destination]: [string, string],
    options: Map<string, cmdOption>
  ): Promise<string | void> {
    // TODO: doc and move to Command
    if (!path || !destination) {
      throw new CommandOptionError(
        `parameters`,
        `missing parameter: ${this.doc.usage}`
      );
    }
    if (!existsSync(path)) {
      throw new CommandOptionError(`path`, `${path} directory does not exist`);
    }

    silly(`path`, path);
    const oldDir = relativeTo(path, this.monorepo.root.path);
    silly(`old directory`, oldDir);
    const newDir = relativeTo(destination, this.monorepo.root.path);
    silly(`new directory`, newDir);

    await ensureDir(absolute(destination));
    if (!(await isEmpty(destination))) {
      throw new RunConditionError(`the destination directory isn't empty`);
    }

    // Get project config

    let projectConfig: SubProjectConfig | null = null;
    try {
      const config = await this.monorepo.getConfig();
      projectConfig = getProject(config, `directory`, oldDir);
    } catch (e) {
      notice(``, `no project config available for ${oldDir}`);
    }
    silly(`config`, `project: %s`, projectConfig);

    // Move files in monorepo

    // TODO: better branch name
    const branchName = `monocli-mv`;
    await this.monorepo.repository.git(`checkout`, [`-b`, branchName]);

    await this.monorepo.repository.git(`mv`, [oldDir, newDir]);
    notice(``, `files moved`);
    await this.monorepo.repository.git(`commit`, [
      `-m`,
      `chore: mv ${oldDir} to ${newDir}`
    ]);
    notice(``, `commit files renaming`);

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

    if (!projectConfig.scope) {
      throw new ConfigError(`no scope found for project ${oldDir}`);
    }

    const splitBranch = `monocli-mv-${projectConfig.scope}`;

    await this.monorepo.repository.git(`subtree`, [
      `split`,
      `--prefix=${newDir}`,
      `-b`,
      splitBranch
    ]);

    const clonePath = resolve(`/tmp`, `monocli`, projectConfig.scope);
    await ensureDir(clonePath);
    const cloneRepo = new Repository(clonePath);
    await cloneRepo.git(`clone`, [`--bare`, projectConfig.url, `.`]);

    await this.monorepo.repository.git(`push`, [
      clonePath,
      `${splitBranch}:master`
    ]);

    // TODO: ask for confirmation
    // TODO: permit to push to another branch and create a PR
    await cloneRepo.git(`push`, [`origin`, `master`]);

    // Update config
    await this.monorepo.updateProjectConfig(`directory`, oldDir, newDir);

    await this.monorepo.repository.git(`commit`, [
      `-m`,
      `build: mv ${projectConfig.scope} via monocli
    
update project directory in monocli config after mv
from ${oldDir} to ${newDir}`,
      Monorepo.CONFIG_FILE_NAME
    ]);
  }
}
