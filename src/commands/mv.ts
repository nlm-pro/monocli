import { MonorepoCommand } from "../models/monorepo-command";
import { cmdOption } from "../models/options";
import { CommandDocumentation } from "../models/documentation";

export class MvCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `mv`,
    usage: `<path> <new-path>`,
    description: `change a subtree prefix`,
    details: `This command requires that <path> is associated with a existing project with an url.
⚠️  Experimental command  ⚠️
  `,
    // TODO
    options: new Map()
  };

  run(
    [path, destination]: [string, string],
    options?: Map<string, cmdOption>
  ): Promise<string | void> {
    throw new Error(`Method not implemented.`);
  }
}
