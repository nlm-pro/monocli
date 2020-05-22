import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { runCommand } from "../utils/command";
import { Monorepo } from "../models/monorepo";

export class UpdateCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `update`,
    usage: `[directory]`,
    description: `update the subtree associated to [directory]`,
    details: `Tries to run the spush command, and retry after a spull if it failed.

To run this command on every project defined in ${Monorepo.CONFIG_FILE_NAME} with a remote url, just leave the [directory] argument blank (the --url option will be ignored in this case)`,
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
    const projects = directory
      ? [{ directory, url: options.get(`url`) }]
      : this.monorepo.getConfig().projects.filter(project => project.url);

    for (const project of projects) {
      const url = project.url as string;
      const spushOptions = new Map<string, cmdOption>([
        ...options.entries(),
        [`url`, url]
      ]);
      const spullOptions = new Map<string, cmdOption>([
        [`url`, url],
        [`branch`, options.get(`branch`) as string]
      ]);
      try {
        spushOptions.set(`force`, false);
        await runCommand(`spush`, [project.directory], spushOptions);
      } catch (e) {
        log.warn(`spush`, `push to subtree remote failed`);
        log.notice(`spull`, `pulling from subtree remote`);
        await runCommand(`spull`, [project.directory], spullOptions);
        await runCommand(`spush`, [project.directory], spushOptions);
      }
      log.notice(directory, `updated`);
    }
  }
}
