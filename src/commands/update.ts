import { resolve } from "path";
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
    this.validateDirectory(directory);

    silly(`path`, directory);

    const config = await this.getProjectConfig(directory, url);

    await this.updateSubtree(config, directory);

    notice(``, `remote subrepo successfully updated`);
  }

  // TODO: doc and move to Command
  validateDirectory(directory: string): void {
    if (!directory) {
      throw new CommandOptionError(
        `parameters`,
        `missing directory parameter: ${this.doc.usage}`
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
  }

  async getProjectConfig(
    directory: string,
    url: string
  ): Promise<{ id: string; remoteUrl: string }> {
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

    let remoteUrl = projectConfig?.url || url;
    if (remoteUrl.match(/^\.\.?\/?/)) {
      remoteUrl = absolute(remoteUrl);
    }

    let id = `${+new Date()}`;
    if (projectConfig?.scope) {
      id = projectConfig.scope.concat(`-${id}`);
    }

    return {
      id,
      remoteUrl
    };
  }

  async updateSubtree(
    config: { id: string; remoteUrl: string },
    directory: string
  ): Promise<void> {
    const splitBranch = `monocli-update-${config.id}`;

    await this.monorepo.repository.git(`subtree`, [
      `split`,
      `--prefix=${directory}`,
      `-b`,
      splitBranch
    ]);

    const cloneRepo = new Repository();
    await cloneRepo.git(`clone`, [`--bare`, config.remoteUrl, `.`]);

    await this.monorepo.repository.git(`push`, [
      cloneRepo.path,
      `${splitBranch}:master`
    ]);

    // TODO: ask for confirmation
    // TODO: permit to push to another branch and create a PR
    await cloneRepo.git(`push`, [`origin`, `master`]);
  }
}
