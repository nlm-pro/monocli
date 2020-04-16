import { resolve, join } from "path";
import { ensureDir, existsSync, statSync } from "fs-extra";
import { notice, silly } from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { cmdOption } from "../models/options";
import { CommandDocumentation } from "../models/documentation";
import { absolute } from "../utils/path";
import { CommandOptionError } from "../models/errors";
import { getProject } from "../utils/config";
import { SubProjectConfig } from "../models/config";
import { Repository } from "../models/git";
import { Monorepo } from "../models/monorepo";

export class UpdateCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `update`,
    usage: `<directory> [url]`,
    description: `update the remote "subtree" repo associated to <directory>`,
    details: ``,
    options: new Map()
  };

  async run(
    [directory, url]: [string, string],
    options?: Map<string, cmdOption>
  ): Promise<string | void> {
    // TODO: doc and move to Command
    if (!directory) {
      throw new CommandOptionError(
        `parameters`,
        `missing parameter: ${this.doc.usage}`
      );
    }

    if (
      !existsSync(absolute(directory)) ||
      !statSync(absolute(directory)).isDirectory()
    ) {
      throw new CommandOptionError(
        `directory`,
        `${absolute(directory)} directory does not exist`
      );
    }

    if (!statSync(absolute(directory)).isDirectory()) {
      throw new CommandOptionError(
        `directory`,
        `${absolute(directory)} isn't a directory`
      );
    }

    silly(`path`, directory);

    // Get project config

    let projectConfig: SubProjectConfig | null = null;

    try {
      const config = await this.monorepo.getConfig();
      projectConfig = getProject(config, `directory`, directory);
      if (projectConfig) {
        silly(`config`, `project: %s`, projectConfig);
      }
    } catch (e) {
      notice(``, `no project config available for ${directory}`);
    }

    if (projectConfig?.url && url && projectConfig?.url !== url) {
      throw new CommandOptionError(
        `url`,
        `a different url is defined for ${directory} in ${Monorepo.CONFIG_FILE_NAME}: ${projectConfig.url}`
      );
    }

    if (!projectConfig?.url && !url) {
      throw new CommandOptionError(
        `url`,
        `no remote url was given for ${directory}`
      );
    }

    const remoteUrl = projectConfig?.url || url;
    let id = `${+new Date()}`;
    if (projectConfig?.scope) {
      id = projectConfig.scope.concat(`-${id}`);
    }

    // Update subtree remote repository
    const splitBranch = `monocli-update-${id}`;

    await this.monorepo.repository.git(`subtree`, [
      `split`,
      `--prefix=${directory}`,
      `-b`,
      splitBranch
    ]);

    const clonePath = resolve(`/tmp`, `monocli`, id);
    await ensureDir(clonePath);
    const cloneRepo = new Repository(clonePath);
    await cloneRepo.git(`clone`, [`--bare`, remoteUrl, `.`]);

    await this.monorepo.repository.git(`push`, [
      clonePath,
      `${splitBranch}:master`
    ]);

    // TODO: ask for confirmation
    // TODO: permit to push to another branch and create a PR
    await cloneRepo.git(`push`, [`origin`, `master`]);

    notice(``, `remote subrepo successfully updated`);
  }
}
