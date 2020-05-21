import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { runCommand } from "../utils/command";

export class UpdateCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `update`,
    usage: `<directory>`,
    description: `update the subtree associated to <directory>`,
    details: `try to run the spush command, and retry after a spull if it failed`,
    // TODO: extend Spush options
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
    const spushOptions = new Map<string, cmdOption>([...options.entries()]);
    const spullOptions = new Map<string, cmdOption>([
      [`url`, options.get(`url`) as string],
      [`branch`, options.get(`branch`) as string]
    ]);
    try {
      spushOptions.set(`force`, false);
      await runCommand(`spush`, [directory], spushOptions);
    } catch (e) {
      log.warn(`spush`, `push to subtree remote failed`);
      log.notice(`spull`, `pulling from subtree remote`);
      await runCommand(`spull`, [directory], spullOptions);
      await runCommand(`spush`, [directory], spushOptions);
    }
    log.notice(directory, `updated`);
  }
}
