import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";

export class StatusCommand extends MonorepoCommand {
  protected readonly doc: CommandDocumentation = {
    name: `status`,
    usage: ``,
    description: `show the monorepo status`,
    details: `include git status and details about the monorepo state and config`,
    options: new Map()
  };

  async run(): Promise<string | void> {
    // TODO: group by subproject
    await this.monorepo.repository.status();
    // TODO: show status of each project compared to its released subtree
  }
}
