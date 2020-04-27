import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { runCommand } from "../utils/command";

export class UpdateCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `update`,
    usage: `<directory> [url]`,
    description: `update (push) the subtree associated to <directory>`,
    details: `alias of the spush command with --force and --branch=master`,
    // TODO: extend Spush options
    options: new Map<string, CommandOptionConfig>()
  };

  async run(
    [directory, url]: [string, string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    options.set(`force`, true);
    options.set(`branch`, `master`);
    await runCommand(`spush`, [directory, url], options);
  }
}
