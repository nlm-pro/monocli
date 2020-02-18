import * as path from "path";
import * as simpleGit from "simple-git/promise";
import * as fs from "fs-extra";
import * as program from "commander";
import { AbstractCommand } from "../models/Command";
import { Logger } from "../utils/logger";
import { Project } from "../models/Project";
import chalk = require(`chalk`);

export class MvCommand extends AbstractCommand {
  static WARNING = `
  ⚠️  Experimental command  ⚠️
`;

  private assets: {
    branches: { rewrite: string; split: string };
    directories: { clone: string };
  };
  private project: Required<Project>;

  constructor(logger: Logger) {
    super(logger, `mv`);
  }

  init(pathToProject: string): void {
    const oldDir = this.monorepo.getRelativePath(pathToProject);
    const possibleProject = this.monorepo.getProjectByPath(oldDir);

    if (
      typeof possibleProject === `undefined` ||
      !possibleProject.name ||
      !possibleProject.url
    ) {
      throw new Error(`no project config available for ${oldDir}`);
    }

    this.project = {
      name: possibleProject.name,
      url: possibleProject.url,
      directory: oldDir
    };

    // TODO: refact
    this.assets = {
      branches: {
        rewrite: `monopm-rewrite-${this.project.name}`,
        split: `monopm-split-${this.project.name}`
      },
      directories: {
        clone: path.join(`/tmp`, this.project.name)
      }
    };
  }

  async clean(): Promise<void> {
    const branches = await this.monorepo.git.branch([]);
    const currentBranch = (
      await this.monorepo.git.raw([`rev-parse`, `--abbrev-ref`, `HEAD`])
    ).trim();
    Object.entries(this.assets.branches).forEach(async ([key, branch]) => {
      if (branches.all.includes(branch) && currentBranch !== branch) {
        await this.monorepo.git.raw([`branch`, `-D`, branch]);
      }
    });
    Object.entries(this.assets.directories).forEach(async ([key, dir]) => {
      await fs.remove(dir);
    });
  }

  async run(pathToProject: string, newPath: string): Promise<void> {
    this.log.log(chalk.yellow(MvCommand.WARNING));
    this.init(pathToProject);
    if (program.force) {
      await this.clean();
    }

    await this.monorepo.git.checkoutLocalBranch(this.assets.branches.rewrite);

    const newDirectory = this.monorepo.getRelativePath(newPath);

    await this.mvDir(newDirectory);

    await this.updateSubtree(newDirectory);

    await this.updateProject(newDirectory);

    await this.monorepo.updateProjectConfig(
      `directory`,
      this.project.directory,
      newDirectory
    );

    await this.monorepo.git.commit(
      `chore: monopm - mv ${this.project.name}
    
update monopm config after mv
    `,
      `monorepo-spm.json`
    );

    await this.clean();
  }

  async mvDir(to: string): Promise<void> {
    this.log.info(`git mv ${this.project.directory} ${to}`);
    const destinationAbsPath = path.resolve(this.monorepo.rootPath, to);
    try {
      await fs.ensureDir(destinationAbsPath);
      const content = await fs.readdir(destinationAbsPath);
      if (content.length > 0) {
        throw new Error(`not empty: ${destinationAbsPath}`);
      }

      await this.monorepo.git.mv(this.project.directory, to);

      await this.monorepo.git.commit(
        `chore(${this.project.name}): mv to ${to}`
      );
    } catch (e) {
      this.exit(`impossible to move ${this.project.directory} to ${to}`, e, 1);
    }
  }

  async updateSubtree(to: string): Promise<void> {
    this.log.info(`update subtree`);
    try {
      await this.monorepo.git.raw([
        `subtree`,
        `split`,
        `--prefix=${to}`,
        `--rejoin`,
        `HEAD`
      ]);
      await this.monorepo.git.raw([
        `subtree`,
        `pull`,
        `--prefix=${to}`,
        this.project.url,
        `master`,
        `--squash`
      ]);
    } catch (e) {
      this.exit(`can't update the subtree`, e, 1);
    }
  }

  async updateProject(prefix: string): Promise<void> {
    this.log.info(`update project`);
    this.log.debug(`clonePath: ${this.assets.directories.clone}`);
    try {
      // TODO: use the update command instead
      await this.monorepo.git.raw([
        `subtree`,
        `split`,
        `--prefix=${prefix}`,
        `-b`,
        this.assets.branches.split
      ]);
      await simpleGit().clone(this.project.url, this.assets.directories.clone, [
        `--bare`
      ]);
      await this.monorepo.git.push(
        this.assets.directories.clone,
        `${this.assets.branches.split}:master`
      );
      await simpleGit(this.assets.directories.clone).push(`origin`, `master`);
    } catch (e) {
      this.exit(`can't update the subproject`, e, 1);
    }
  }
}
