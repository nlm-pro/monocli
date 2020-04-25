import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";

export class SPullCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `spull`,
    usage: `<directory> [url]`,
    description: `update (pull) <directory> subtree from a remote repo`,
    details: `Not implemented yet!`,
    options: new Map<string, CommandOptionConfig>([
      [
        `branch`,
        {
          type: `string`,
          description: `name of the remote branch you would want to push to`,
          defaultValue: `master`
        }
      ]
    ])
  };

  async run(
    [directory, url]: [string, string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    log.error(`command`, `not implemented yet`);
  }
}
