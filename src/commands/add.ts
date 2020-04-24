import { resolve, basename } from "path";
import { existsSync, mkdirp } from "fs-extra";
import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { ensureNotEmptyDir } from "../utils/fs";
import { getProject } from "../utils/config";
import { relativeTo } from "../utils/path";
import {
  CommandOptionError,
  RunConditionError,
  ExitError
} from "../models/errors";
import { Repository } from "../models/git";
import { output } from "../utils/log";
import { confirm } from "../utils/prompt";
import { SubProjectConfig } from "../models/config";

export type AddCmdUrls = {
  remote: string;
  clone: string;
} | null;

export class AddCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `add`,
    usage: `<path> [url] [...options]`,
    description: `add, convert or import a project`,
    // TODO
    details: `
<path>   path to the project directory
[url]    subrepo origin url (default: from submodule)
 
Behavior depends on what the <path> directory contains and if you provided an [url] or not:
  - if <path> is a submodule, it will be converted to a "subproject"
  - if [url] is provided, the associated repository will be imported (overriding any pre-existing submodule)
  - finally, the project's data will be added to the configuration`,
    options: new Map<string, CommandOptionConfig>([
      [
        `yes`,
        {
          type: `boolean`,
          description: `Assume "yes" as answer to all prompts and run non-interactively`
        }
      ],
      [
        `scope`,
        {
          type: `string`,
          description: `conventional commit scope`,
          defaultValue: ([path]): string => {
            return basename(path);
          },
          defaultDescription: `path basename`
        }
      ],
      [
        `rewrite`,
        {
          type: `boolean`,
          description: `rewrite subproject history before merge`
        }
      ]
    ])
  };

  async run(
    [path, urlOption]: [string, string],
    options: Map<string, cmdOption>
  ): Promise<void> {
    const directory = relativeTo(path, this.monorepo.root.path);

    await this.checkProject(directory);

    const { urls, isSubmodule } = await this.prepareSubmodule(
      directory,
      urlOption
    );

    const scope = options.get(`scope`) as string;

    const config: SubProjectConfig = {
      scope,
      directory
    };

    if (urls !== null) {
      config.url = urls.remote;

      const cloneRepo = new Repository();
      await cloneRepo.git(`clone`, [urls.clone, `.`]);

      await this.mvFiles(cloneRepo, directory);

      await cloneRepo.git(`commit`, [
        `-m`,
        `chore(${scope}): Move all files into ${directory}`
      ]);

      const branch = `monocli-add-${scope}`;

      if (options.get(`rewrite`)) {
        await this.rewriteHistory(
          cloneRepo,
          scope,
          !options.get(`yes`),
          branch
        );
      } else {
        await cloneRepo.git(`checkout`, [`-b`, branch]);
      }

      await cloneRepo.git(`remote`, [`add`, `subrepo`, urls.remote]);

      await cloneRepo.git(`push`, [`subrepo`, branch, `--force`]);

      await this.monorepo.repository.git(`remote`, [`add`, scope, urls.remote]);

      // TODO: use "subtree add" instead
      await this.monorepo.repository.git(`fetch`, [scope, branch]);

      if (isSubmodule) {
        await this.monorepo.repository.deleteSubmodule(directory);
      }

      await this.monorepo.repository.git(`merge`, [
        `--allow-unrelated-histories`,
        `${scope}/${branch}`
      ]);
    }

    await this.monorepo.addProjectConfig(config);

    await this.monorepo.repository.git(`commit`, [
      `-am`,
      `build: add monocli config for ${directory}`
    ]);

    // TODO: force/branch option
    log.notice(
      ``,
      urls
        ? `you should now check everything is ok and then run the update command`
        : `project added to configuration`
    );
  }

  async prepareSubmodule(
    directory: string,
    url: string
  ): Promise<{
    urls: AddCmdUrls;
    isSubmodule: boolean;
  }> {
    const submodules = await this.monorepo.repository.getSubmodules();
    const submodule = submodules.get(directory);

    let urls: AddCmdUrls = {
      remote: url || submodule?.url || ``,
      clone: url
    };

    if (!urls.remote) {
      urls = null;
    }

    const pathToDirectory = resolve(this.monorepo.root.path, directory);

    let isSubmodule = false;

    if (urls === null || !submodule) {
      ensureNotEmptyDir(pathToDirectory);
    } else if (!url) {
      await this.monorepo.repository.git(`submodule`, [`update`]);

      urls.clone = pathToDirectory;
      isSubmodule = true;
    } else {
      await this.monorepo.repository.deleteSubmodule(directory);
      log.warn(`submodule`, `existing submodule deleted`);
      urls.remote = url;
    }

    return {
      urls,
      isSubmodule
    };
  }

  async checkProject(directory: string): Promise<void> {
    const config = await this.monorepo.getConfig();

    let project: SubProjectConfig | null = null;

    try {
      project = getProject(config, `directory`, directory);
    } catch (e) {
      log.info(`add`, `no pre-existing project in ${directory}`);
    }

    if (project !== null) {
      throw new CommandOptionError(
        `directory`,
        `a project was already added for this directory`
      );
    }
  }

  async mvFiles(repo: Repository, dest: string): Promise<void> {
    // moving files in submodule in order to merge the unrelated project history

    const newRoot = resolve(repo.path, dest);
    if (existsSync(newRoot)) {
      throw new RunConditionError(
        `project can't be converted as ${dest} already exists`
      );
    }
    await mkdirp(newRoot);

    const tree = (await repo.git(`ls-tree`, [`master`, `--name-only`])).split(
      `\n`
    );

    for (const file of tree) {
      if (file) {
        await repo.git(`mv`, [file, dest]);
      }
    }
  }

  async rewriteHistory(
    repo: Repository,
    scope: string,
    interactive: boolean,
    branch: string
  ): Promise<void> {
    const commits = (await repo.git(`rev-list`, [`--all`, `--reverse`])).split(
      `\n`
    );

    await repo.git(`checkout`, [`--orphan`, branch]);

    for (const commit of commits) {
      let message = (
        await repo.git(`log`, [`-1`, `--pretty=%B`, commit])
      ).trim();

      try {
        await repo.git(`cherry-pick`, [
          `--no-commit`,
          `-m`,
          `1`,
          `--strategy=recursive`,
          `-X`,
          `theirs`,
          commit
        ]);
      } catch (e) {
        if (interactive) {
          log.error(`rewrite`, e);

          log.info(
            `git`,
            `go to ${repo.path} and resolve the conflict in another terminal`
          );

          const shouldContinue = await confirm(
            `Did you resolved this conflict? (y to continue, or N to abort)?`
          );

          if (!shouldContinue) {
            throw new ExitError(`rewrite aborted`);
          }
        } else {
          throw new ExitError(
            `rewrite failed due to a git conflict - retry with interactive mode on`
          );
        }
      }

      if (!message.startsWith(`Merge`) && !message.startsWith(`Revert`)) {
        const commitHeadRegex = /^([\w-]+)(?:[[(]([\w -#/]+)[\])])?: ?(.*)/;
        const msgLines = message.split(`\n`);
        const parsedHead = commitHeadRegex.exec(message);
        const msg = {
          type: parsedHead?.[1] || `chore`,
          description:
            (parsedHead ? parsedHead[3] : msgLines[0]) || `no description`
        };
        message = [
          `${msg.type}(${scope}): ${msg.description}`,
          ...msgLines.slice(1)
        ].join(`\n`);
      }

      await repo.git(`commit`, [`-m`, message, `--allow-empty`]);

      if (interactive) {
        output(message);

        const isMsgOk = await confirm(
          `Is this commit message OK (n to reword)?`
        );

        if (!isMsgOk) {
          await repo.git(`commit`, [`--amend`]);
        }
      }
    }
  }
}
