import * as path from "path";
import * as simpleGit from "simple-git/promise";
import * as fs from "fs-extra";
import { AbstractCommand } from "../models/Command";
import { Logger } from "../utils/logger";
import { Project } from "../models/Project";
import { Monorepo } from "../models/Monorepo";

interface UpdateCommandOptions {
  force: boolean;
  branch: string;
}

// TODO: create a super class in order to unify with the AddCommand
class ProjectToUpdate implements Project {
  private config: Project;

  constructor(
    private monorepo: Monorepo,
    private pathFromCwd: string,
    public urlOption: string
  ) {
    this.init();
  }

  init(): void {
    this.config = this.monorepo.getProjectByPath(this.pathFromCwd) || {};
  }

  get clonePath(): string {
    return path.join(`/tmp`, this.name);
  }

  get git(): simpleGit.SimpleGit {
    return simpleGit(this.clonePath);
  }

  get name(): string {
    return this.config.name || path.basename(this.directory);
  }

  get url(): string {
    const url = this.urlOption || this.config.url;
    if (typeof url === `undefined`) {
      throw new Error(`no remote url available for this subproject`);
    }

    return url;
  }

  get directory(): string {
    return (
      this.config.directory || this.monorepo.getRelativePath(this.pathFromCwd)
    );
  }
}

export class UpdateCommand extends AbstractCommand {
  private project: ProjectToUpdate;

  constructor(logger: Logger) {
    super(logger, `update`);
  }

  init(pathToProject: string, url: string): void {
    this.project = new ProjectToUpdate(this.monorepo, pathToProject, url);
  }

  async run(
    pathToProject: string,
    url: string,
    options: UpdateCommandOptions
  ): Promise<void> {
    // TODO: use the check command, except if --force

    try {
      this.init(pathToProject, url);
    } catch (e) {
      this.exit(`an error occurred when initializing the command`, e, 1);
    }

    await this.clean();

    try {
      this.log.info(`cloning ${this.project.url}...`);
      await simpleGit().clone(
        this.project.url as string,
        this.project.clonePath as string
      );
      this.log.success(`clone succeed`);
    } catch (e) {
      this.exit(`unable to clone ${this.project.url}`, e, 1);
    }

    try {
      // TODO: better name
      this.log.info(`create the release split branch`);
      await this.monorepo.git.raw([
        `subtree`,
        `split`,
        `--pref=${this.project.directory}`,
        `--squash`,
        `-b`,
        `split`
      ]);
    } catch (e) {
      this.exit(`subtree error`, e, 1);
    }

    try {
      this.log.info(`Push the subtree to the subproject clone`);
      // TODO: check if there is something to push
      // TODO: permit to push to another branch and create a PR, and use this as a fallback
      await this.monorepo.git.push(this.project.clonePath, `split:master`);
    } catch (e) {
      this.exit(
        `unable to push the subtree to ${this.project.clonePath}`,
        e,
        1
      );
    }

    try {
      this.log.info(`Push to ${this.project.url}`);
      await this.project.git.push(`origin`, `master`);
    } catch (e) {
      this.exit(`unable to push to ${this.project.url}`, e, 1);
    }

    await this.clean();
  }

  async clean(): Promise<void> {
    try {
      fs.removeSync(this.project.clonePath);
      await this.monorepo.git.deleteLocalBranch(`split`);
    } catch (e) {
      this.log.debug(e);
    }
  }
}
