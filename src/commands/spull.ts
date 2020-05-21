import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { CommandOptionConfig, cmdOption } from "../models/options";

export class SPullCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `spull`,
    usage: `<directory>`,
    description: `update (pull) <directory> subtree from a remote repo`,
    // TODO
    details: ``,
    options: new Map<string, CommandOptionConfig>([
      [
        `url`,
        {
          type: `string`,
          description: `url of the subtree remote`,
          defaultDescription: `from config if exists`,
          defaultValue: ``
        }
      ],
      [
        `branch`,
        {
          type: `string`,
          description: `name of the destination branch in the subtree remote`,
          defaultValue: `master`
        }
      ]
    ])
  };

  async run(
    [directory]: [string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    const { remoteUrl } = this.getProjectRemote(
      directory,
      options.get(`url`) as string
    );
    await this.monorepo.repository.git(`subtree`, [
      `pull`,
      `--prefix`,
      directory,
      remoteUrl,
      options.get(`branch`) as string
    ]);
    log.notice(
      `success`,
      `local directory ${directory} successfully updated from ${remoteUrl}`
    );
  }
}
