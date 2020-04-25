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
    // FIXME: add subtree if necessary
    await this.monorepo.repository.git(`subtree`, [
      `pull`,
      `--prefix`,
      directory,
      `--squash`,
      remoteUrl,
      branch
    ]);
  }
}
