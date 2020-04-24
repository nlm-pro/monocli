import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";

export class SPullCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `spull`,
    usage: `<directory> [url] [branch]`,
    description: `update (pull) <directory> subtree from a remote repo`,
    // TODO
    details: ``,
    options: new Map<string, CommandOptionConfig>()
  };

  async run(
    [directory, urlOption, branch]: [string, string, string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    branch = branch || `master`;
    const { remoteUrl } = await this.getProjectRemote(directory, urlOption);
    // TODO: check for existing remote
    try {
      await this.monorepo.repository.git(`subtree`, [
        `pull`,
        `--prefix`,
        directory,
        remoteUrl,
        branch
      ]);
      log.notice(
        `success`,
        `local directory ${directory} successfully updated from ${remoteUrl}`
      );
    } catch (e) {
      log.error(
        `git`,
        `can't pull the subtree. Did you forget to add this subproject before?`
      );
    }
  }
}
