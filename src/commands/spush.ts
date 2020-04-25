import { existsSync, statSync } from "fs-extra";
import { notice, silly, error } from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { absolute } from "../utils/path";
import { CommandOptionError } from "../models/errors";
import { getProject } from "../utils/config";
import { SubProjectConfig } from "../models/config";
import { Repository } from "../models/git";
import { Monorepo } from "../models/monorepo";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { confirm } from "../utils/prompt";

export class SPushCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `spush`,
    usage: `<directory> [url]`,
    description: `update (push to) the remote "subtree" repo associated to <directory>`,
    details: ``,
    options: new Map<string, CommandOptionConfig>([
      [
        `force`,
        {
          type: `boolean`,
          description: `Force push to the remote repository. Use with caution!`
        }
      ],
      [
        `branch`,
        {
          type: `string`,
          description: `name of the remote branch you would want to push to`,
          defaultValue: `master`
        }
      ]
    ])
  };

  async run(
    [directory, url]: [string, string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    this.validateDirectory(directory);

    silly(`path`, directory);

    const config = await this.getProjectConfig(directory, url);

    await this.pushSubtree(
      config,
      directory,
      (options.get(`branch`) as string) || `master`,
      options.get(`trust`) !== true,
      options.get(`force`) === true
    );
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

  async pushSubtree(
    config: { id: string; remoteUrl: string },
    directory: string,
    branch: string,
    interactive: boolean,
    force: boolean
  ): Promise<void> {
    const splitBranch = `monocli-spush-${config.id}`;

    await this.monorepo.repository.git(`subtree`, [
      `split`,
      `--prefix=${directory}`,
      `-b`,
      splitBranch
    ]);

    const cloneRepo = new Repository();
    await cloneRepo.git(`clone`, [`--bare`, config.remoteUrl, `.`]);

    try {
      await this.monorepo.repository.git(`push`, [
        cloneRepo.path,
        `${splitBranch}:${branch}`
      ]);

      await cloneRepo.git(`push`, [`origin`, branch]);
      notice(``, `remote subrepo successfully updated`);
    } catch (e) {
      error(`git`, `Push to ${config.remoteUrl} ${branch} branch failed!`);
      error(`git`, e.message);

      let forcePush = force;

      if (interactive) {
        forcePush = await confirm(`Force push?`);
      } else {
        // "interactive" only reflects the --trust option here
        forcePush = true;
      }

      if (forcePush) {
        await cloneRepo.git(`push`, [`origin`, branch, `--force-with-lease`]);
        notice(``, `remote subrepo successfully updated`);
      } else {
        notice(
          `git`,
          `Go to ${cloneRepo.path} in order to resolve this conflict, or re-run this command with the --force option.`
        );
      }
    }
  }
}
