import { existsSync, statSync } from "fs-extra";
import { notice, silly, error } from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { absolute } from "../utils/path";
import { CommandOptionError } from "../models/errors";
import { Repository } from "../models/git";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { confirm } from "../utils/prompt";

export class SPushCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `spush`,
    usage: `<directory> [url] [branch]`,
    description: `update (push to) the remote "subtree" repo associated to <directory>`,
    details: `
url: url of the subtree remote (default: from config if exists)
branch: name of the destination branch in the subtree remote (default: master)
    `,
    options: new Map<string, CommandOptionConfig>([
      [
        `force`,
        {
          type: `boolean`,
          description: `Force push (with lease) to the remote repository. Use with caution!`
        }
      ]
    ])
  };

  async run(
    [directory, url, branch]: [string, string, string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    this.validateDirectory(directory);

    silly(`path`, directory);

    const config = this.getProjectRemote(directory, url);

    await this.pushSubtree(
      config,
      directory,
      branch || `master`,
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
