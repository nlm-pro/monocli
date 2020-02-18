import * as git from "simple-git/promise";
import { AbstractCommand } from "../models/Command";
import { Logger } from "../utils/logger";

const semver = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export class CheckCommand extends AbstractCommand {
  constructor(logger: Logger) {
    super(logger, `check`);
  }

  async run(directory: string, options: { tag: string | null }): Promise<void> {
    let releaseTags: string[] = [];
    try {
      const latestCommit = (
        await git().raw([
          `log`,
          `-1`,
          `--format=format:%H`,
          `--full-diff`,
          directory
        ])
      ).trim();
      this.log.info(`Latest commit in ${directory} is ${latestCommit}\n`);
      this.log.debug(`--tag ${options.tag}`);
      if (!options.tag) {
        const tags = (await git().tags({ "--contains": latestCommit })).all;
        releaseTags = tags.filter(tag => tag.match(semver));
      } else {
        const tag = await git().tag([options.tag, `--contains`, latestCommit]);
        if (tag) {
          releaseTags.push(tag);
        }
      }
    } catch (e) {
      this.exit(`unable to get tags`, e, 1);
    }

    if (releaseTags.length > 0) {
      this.log.error(
        `last version of ${directory} has already been released in:\n\t${releaseTags.join(
          `\n\t`
        )}`
      );
      process.exit(1);
    } else {
      this.log.success(
        `last version of ${directory} has not been released yet`
      );
    }
  }
}
