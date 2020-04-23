import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { ExitError } from "../models/errors";

export const SEMVER_PATTERN = `v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?`;

const semver = new RegExp(`^${SEMVER_PATTERN}$`);

export class CheckCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `check`,
    usage: `<directory>`,
    description: `check if <directory> has changed since a release`,
    details: `
fails (non zero exit code) if the last commit including changes in <directory> is behind the specified (or latest semver) tag

useful for release scripts and incremental builds
`,
    options: new Map<string, CommandOptionConfig>([
      [
        `tag`,
        {
          type: `string`,
          description: `tag name to check against`,
          defaultValue: null,
          defaultDescription: `latest semver compliant tag name`
        }
      ]
    ])
  };

  async run(
    [directory]: [string],
    options: Map<string, cmdOption>
  ): Promise<void> {
    let releaseTags: string[] = [];

    const latestCommit = (
      await this.monorepo.repository.git(
        `log`,
        [`-1`, `--format=format:%H`, `--full-diff`, directory],
        `get the hash code of the latest commit affecting ${directory}`,
        true
      )
    ).trim();

    const tag = options.get(`tag`) as string | null;
    if (!tag) {
      const validTags = (
        await this.monorepo.repository.git(
          `tag`,
          [`--contains`, latestCommit],
          `get all tags after ${latestCommit}`,
          true
        )
      ).split(`\n`);
      releaseTags = validTags.filter(tag => semver.exec(tag));
    } else {
      const validTag = await this.monorepo.repository.git(
        `tag`,
        [tag, `--contains`, latestCommit],
        `return ${tag} only if it's after ${latestCommit}`,
        true
      );
      if (validTag) {
        releaseTags.push(validTag);
      }
    }

    if (releaseTags.length > 0) {
      throw new ExitError(
        `check failed: last version of ${directory} has already been released`,
        releaseTags
      );
    } else {
      const when = options.get(`tag`)
        ? `isn't part of ${options.get(`tag`)}`
        : `has not been released yet`;
      log.notice(``, `last version of ${directory} ${when}`);
    }
  }
}
