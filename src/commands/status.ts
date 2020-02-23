import { Command, CommandOptionConfig } from "../models/Command";

export class StatusCommand extends Command {
  protected readonly name = `status`;
  protected readonly usage = ``;
  protected readonly description = `show the monorepo status`;
  protected readonly details = `include git status and details about the monorepo state and config`;
  protected readonly options: Map<string, CommandOptionConfig> = new Map([]);

  async run(): Promise<string | void> {
    // TODO: group by subproject
    await this.monorepo.repository.status();
    // TODO: show status of each project compared to its released subtree
  }
}
