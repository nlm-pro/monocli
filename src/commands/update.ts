import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { buildCommand } from "../utils/build-command";
import { SPushCommand } from "./spush";

export class UpdateCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `update`,
    usage: `<directory> [url]`,
    description: `update (push & pull) the subtree associated to <directory>`,
    details: `This command will first try to push to the remote "subtree repo".
If it fails, it will try to pull new commits from this repo, then push again.
This is equivalent to running the spull, then the spush command, except spull will be run only if necessary.`,
    // TODO: permit to extend other commands options
    options: new Map<string, CommandOptionConfig>([
      [
        `force`,
        {
          type: `boolean`,
          description: `Force push to the remote repository. Use with caution!`
        }
      ],
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
    const update = buildCommand(`spush`) as SPushCommand;
    await update.run([directory, url], options);
  }
}
