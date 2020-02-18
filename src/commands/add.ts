import * as path from "path";
import * as program from "commander";
import * as simpleGit from "simple-git/promise";
import * as fs from "fs-extra";
import { sync as parser } from "conventional-commits-parser";
import { DefaultLogFields, ListLogLine } from "simple-git/typings/response";
import { Monorepo } from "../models/Monorepo";
import { yn } from "../utils/prompt";
import { AbstractCommand } from "../models/Command";
import { Logger } from "../utils/logger";
import { Project } from "../models/Project";

interface AddOptions {
  name?: string;
  amend?: boolean;
}

class Subrepo implements Project {
  constructor(private monorepo: Monorepo) {}

  pathRelativeToCwd: string;
  submodule: string | null;
  name: string;
  url: string;
  cloneOrigin: string;

  get directory(): string {
    return (
      this.pathRelativeToCwd &&
      this.monorepo.getRelativePath(this.pathRelativeToCwd)
    );
  }

  get clonePath(): string {
    return path.join(`/tmp`, this.name);
  }

  get absolutePath(): string {
    return path.join(this.monorepo.rootPath, this.directory);
  }

  get branches(): { rewrite: string; tmp: string } {
    return {
      rewrite: `monopm-rewrite`,
      tmp: `monopm-import`
    };
  }

  get git(): simpleGit.SimpleGit {
    return simpleGit(this.clonePath);
  }
}

export class AddCommand extends AbstractCommand {
  private subrepo: Subrepo = new Subrepo(this.monorepo);

  constructor(logger: Logger) {
    super(logger, `add`);
  }

  async enforceOptions(
    isSubmodule: boolean,
    subrepoUrl: string
  ): Promise<void> {
    if (isSubmodule) {
      if (subrepoUrl && subrepoUrl !== this.subrepo.url) {
        this.log.warning(
          `The value from the --url option will be used instead of the submodule one`
        );
      }
    }
  }

  async prepare(isSubmodule: boolean): Promise<void> {
    await fs.remove(this.subrepo.clonePath);
    await fs.ensureDir(this.subrepo.clonePath);

    if (isSubmodule) {
      try {
        await this.monorepo.git.submoduleUpdate();
      } catch (e) {
        this.exit(`failed to update submodule`, e, 1);
      }

      this.log.info(`${this.subrepo.directory} is a submodule:
\tname: ${this.subrepo.submodule}
\turl : ${this.subrepo.url}`);
    } else {
      await fs.ensureDir(this.subrepo.absolutePath);
      const content = await fs.readdir(this.subrepo.absolutePath);
      if (content.length !== 0) {
        if (this.subrepo.url) {
          this.log.warning(`${this.subrepo.directory} is not empty`);
        }
      } else {
        if (!this.subrepo.url) {
          this.log.warning(`${this.subrepo.directory} is empty`);
          await fs.createFile(path.join(this.subrepo.absolutePath, `.gitkeep`));
        }
      }
    }
  }

  async init(
    subrepoDirectory: string,
    subrepoUrl: string,
    options: AddOptions
  ): Promise<void> {
    this.subrepo.pathRelativeToCwd = subrepoDirectory;

    this.subrepo.submodule = await this.getSubmoduleName(
      this.subrepo.directory
    );

    await this.enforceOptions(!!this.subrepo.submodule, subrepoUrl);

    this.subrepo.name =
      (typeof options.name === `string` && options.name) ||
      this.subrepo.submodule ||
      path.basename(this.subrepo.directory);
    this.subrepo.cloneOrigin =
      subrepoUrl || (this.subrepo.submodule ? this.subrepo.absolutePath : ``);

    let submoduleUrl;
    if (this.subrepo.submodule) {
      try {
        submoduleUrl = (
          await this.monorepo.git.raw([
            `config`,
            `-f`,
            path.resolve(this.monorepo.rootPath, `.gitmodules`),
            `--get`,
            `submodule.${this.subrepo.submodule}.url`
          ])
        ).trim();
      } catch (e) {
        this.subrepo.submodule = null;
        this.log.warning(`failed to get submodule url`);
      }
    }

    this.subrepo.url = submoduleUrl || subrepoUrl;

    this.log.debug(options);
    this.log.debug(this.subrepo);
    this.log.debug(this.monorepo);
  }

  async run(
    subrepoDirectory: string,
    subrepoUrl: string,
    options: AddOptions
  ): Promise<void> {
    await this.init(subrepoDirectory, subrepoUrl, options);

    await this.prepare(!!this.subrepo.submodule);

    const hasGitSubrepo = !!this.subrepo.cloneOrigin;
    if (hasGitSubrepo) {
      try {
        this.log.info(`cloning subproject...`);
        await simpleGit().clone(
          this.subrepo.cloneOrigin,
          this.subrepo.clonePath
        );
      } catch (e) {
        this.exit(`failed to clone subproject`, e, 1);
      }

      try {
        await this.checkGitConflicts(program.force);
      } catch (e) {
        this.exit(`git conflicts was found`, e, 1);
      }

      try {
        await this.moveAndCommit(this.subrepo.directory, this.subrepo.name);
      } catch (e) {
        this.exit(`failed to move subrepo files`, e, 1);
      }

      try {
        await this.rewriteHistory(!!options.amend);
      } catch (e) {
        this.exit(`failed to rewrite history`, e, 1);
      }

      try {
        await this.monorepo.git.checkoutLocalBranch(
          this.monorepo.branchName(this.subrepo.name)
        );
      } catch (e) {
        this.exit(`failed to move to a new branch`, e, 1);
      }

      if (this.subrepo.submodule) {
        try {
          await this.deleteSubmodule(this.subrepo.directory);
        } catch (e) {
          this.exit(`failed to delete submodule`, e, 1);
        }
      }

      try {
        await this.mergeSubrepo();
      } catch (e) {
        this.exit(`failed to merge subrepo`, e, 1);
      }
    }

    try {
      this.log.info(`saving to config file...`);
      await this.monorepo.addProject({
        name: this.subrepo.name,
        url: this.subrepo.url,
        directory: this.subrepo.directory
      });
      this.log.success(
        `project ${this.subrepo.name} saved in ${Monorepo.CONFIG_FILE_NAME}`
      );
    } catch (e) {
      this.exit(`failed to add project to config`, e, 1);
    }

    if (hasGitSubrepo && program.commit) {
      try {
        await this.commitConfig();
      } catch (e) {
        this.exit(`failed to add project to config`, e, 1);
      }
    }
  }

  async commitConfig(): Promise<void> {
    this.log.info(`commit changes to the monorepo...`);
    await this.monorepo.git.add(
      this.monorepo.getRelativePath(this.monorepo.configFilePath)
    );
    await this.monorepo.git.commit(
      `build: add ${this.subrepo.name} to monorepo config`
    );
    this.log.success(`All done!`);
  }

  async checkGitConflicts(force = false): Promise<void> {
    const branches = await this.subrepo.git.branch([]);
    const monoRepoBranches = await this.monorepo.git.branch([]);
    if (force) {
      this.log.info(`force reset`);
      await this.subrepo.git.reset(`hard`);
      if (
        branches.current === this.subrepo.branches.tmp ||
        branches.current === this.subrepo.branches.rewrite
      ) {
        await this.subrepo.git.checkout(`master`);
      }
      if (branches.all.includes(this.subrepo.branches.tmp)) {
        await this.subrepo.git.raw([`branch`, `-D`, this.subrepo.branches.tmp]);
      }
      if (
        monoRepoBranches.all.includes(
          this.monorepo.branchName(this.subrepo.name)
        )
      ) {
        await this.monorepo.git.raw([
          `branch`,
          `-D`,
          this.monorepo.branchName(this.subrepo.name)
        ]);
      }
      if (branches.all.includes(this.subrepo.branches.rewrite)) {
        await this.subrepo.git.raw([
          `branch`,
          `-D`,
          this.subrepo.branches.rewrite
        ]);
      }
    } else if (branches.all.includes(this.subrepo.branches.tmp)) {
      throw new Error(
        `This subrepo already had a branch named ${this.subrepo.branches.tmp}. Use --force to delete it`
      );
    } else if (branches.all.includes(this.subrepo.branches.rewrite)) {
      throw new Error(
        `This subrepo already had a branch named ${this.subrepo.branches.rewrite}. Use --force to delete it`
      );
    } else if (
      monoRepoBranches.all.includes(this.monorepo.branchName(this.subrepo.name))
    ) {
      throw new Error(
        `This monorepo already has a branch named ${this.monorepo.branchName(
          this.subrepo.name
        )}. Use --force to delete it`
      );
    }
  }

  async rewriteHistory(amend: boolean): Promise<void> {
    // FIXME: (in simple-git) all returns a readonly array
    const commits = ((await this.subrepo.git.log()).all as (DefaultLogFields &
      ListLogLine)[]).reverse();

    this.log.info(`rewriting history...`);
    await this.subrepo.git.raw([
      `checkout`,
      `--orphan`,
      this.subrepo.branches.rewrite
    ]);

    for (const commit of commits) {
      await this.rewordAndCommit(commit, this.subrepo.name, amend);
    }

    await this.subrepo.git.addRemote(`subrepo`, this.subrepo.url);
    const pushOpts: simpleGit.Options = {};
    if (program.force) {
      pushOpts[`--force`] = null;
    }
    this.log.debug(pushOpts);
    this.log.debug(this.subrepo.branches.rewrite);
    await this.subrepo.git.push(
      `subrepo`,
      this.subrepo.branches.rewrite,
      pushOpts
    );
    this.log.success(`new branch ${this.subrepo.branches.rewrite} pushed`);
  }

  async mergeSubrepo(): Promise<void> {
    this.log.info(`merging subproject...`);
    const remotes = await this.monorepo.git.getRemotes(true);
    if (remotes.find(remote => remote.name === this.subrepo.name)) {
      if (program.force) {
        await this.monorepo.git.removeRemote(this.subrepo.name);
      } else {
        throw new Error(
          `remote ${this.monorepo.branchName(
            this.subrepo.name
          )} already exists. Use --force to override it.`
        );
      }
    }
    await this.monorepo.git.addRemote(this.subrepo.name, this.subrepo.url);
    // TODO: use "subtree add" instead
    await this.monorepo.git.fetch(
      this.subrepo.name,
      this.subrepo.branches.rewrite
    );
    await this.monorepo.git.raw([
      `merge`,
      `--allow-unrelated-histories`,
      `${this.subrepo.name}/${this.subrepo.branches.rewrite}`
    ]);
    this.log.success(`subproject merged`);
  }

  async getSubmoduleName(directory: string): Promise<string | null> {
    let modules, submodule;
    try {
      modules = (
        await this.monorepo.git.raw([
          `config`,
          `-f`,
          path.resolve(this.monorepo.rootPath, `.gitmodules`),
          `--get-regexp`,
          `submodule.*.path`
        ])
      ).split(`\n`);
      submodule = modules.find(entry => entry.split(` `)[1] === directory);
    } catch (e) {
      this.log.warning(`failed to get submodule name`);
    }

    return (
      (submodule &&
        submodule
          .split(` `)[0]
          .split(`.`)[1]
          .trim()) ||
      null
    );
  }

  async moveAndCommit(directory: string, scope: string): Promise<void> {
    this.log.info(`move files and commit`);
    await this.subrepo.git.checkoutLocalBranch(this.subrepo.branches.tmp);
    await fs.ensureDir(path.join(this.subrepo.clonePath, directory));

    const tree = (
      await this.subrepo.git.raw([`ls-tree`, `master`, `--name-only`])
    ).split(`\n`);
    for (const file of tree) {
      if (file) {
        await this.subrepo.git.mv(file, directory);
      }
    }
    this.log.info(`files moved to ${directory}`);

    await this.subrepo.git.commit(
      `chore(${scope}): Move all files into ${directory}`
    );
  }

  async rewordAndCommit(
    commit: { message: string; hash: string; body: string },
    scope: string,
    amend: boolean
  ): Promise<void> {
    this.log.debug(commit.message);

    let message = commit.message;

    try {
      await this.subrepo.git.raw([
        `cherry-pick`,
        `--no-commit`,
        `-m`,
        `1`,
        `--strategy=recursive`,
        `-X`,
        `theirs`,
        commit.hash
      ]);
    } catch (e) {
      this.log.error(e);
      this.log.info(
        `go to ${this.subrepo.clonePath} and resolve the conflict in another terminal`
      );

      if (
        !(await yn(
          `Continue (only if the conflict was resolved, or N to abort)?`
        ))
      ) {
        this.log.info(`stopping the process...`);
        process.exit(0);
      }
    }

    if (
      !commit.message.startsWith(`Merge`) &&
      !commit.message.startsWith(`Revert`)
    ) {
      const parsedMessage = parser(`${commit.message}\n\n${commit.body}`);
      message = `${parsedMessage.type ||
        `chore`}(${scope}): ${parsedMessage.subject || parsedMessage.header}`;
      if (parsedMessage.body) {
        message = message.concat(`\n\n${parsedMessage.body}`);
      }
      if (parsedMessage.footer) {
        message = message.concat(`\n\n${parsedMessage.footer}`);
      }
    }
    await this.subrepo.git.commit(message, [], { "--allow-empty": null });

    if (amend) {
      this.log.raw(`\n${message}\n`);

      if (await yn(`Reword this commit?`)) {
        await this.subrepo.git.raw([`commit`, `--amend`]);
      }
    }
  }

  async deleteSubmodule(directory: string): Promise<void> {
    this.log.info(`deleting submodule...`);
    await this.monorepo.git.subModule([`deinit`, directory]);
    await this.monorepo.git.rm([directory]);
    await this.monorepo.git.commit(`chore: delete submodule at ${directory}`);
    await fs.remove(path.join(`.git/modules/`, directory));
    this.log.success(`submodule ${this.subrepo.directory} deleted`);
  }
}
