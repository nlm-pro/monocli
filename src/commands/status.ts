import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { output } from "../utils/log";

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
    const gitStatus = await this.monorepo.repository.git(`status`);
    output(gitStatus);
    // TODO: show status of each project compared to its released subtree
  }
}
