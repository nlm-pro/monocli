import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { CommandOptionConfig, cmdOption } from "../models/options";
import { Monorepo } from "../models/monorepo";

export class SPullCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `spull`,
    usage: `[directory]`,
    description: `update (pull) [directory] subtree from a remote repo`,
    details: `To run this command on every project defined in ${Monorepo.CONFIG_FILE_NAME} with a remote url, just leave the [directory] argument blank (the --url option will be ignored in this case)`,
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
    const branch = options.get(`branch`) as string;

    const projects = directory
      ? [
          {
            directory,
            url: this.getProjectRemote(directory, options.get(`url`) as string)
              .remoteUrl
          }
        ]
      : this.monorepo.getConfig().projects.filter(project => project.url);

    for (const project of projects) {
      await this.monorepo.repository.git(`subtree`, [
        `pull`,
        `--prefix`,
        project.directory,
        project.url as string,
        branch
      ]);
      log.notice(`${project.directory}`, `pulled ${project.url}`);
    }
  }
}
