import * as log from "npmlog";
import { existsSync } from "fs-extra";
import { Command } from "../models/command";
import { output } from "../utils/log";
import { CommandDocumentation } from "../models/documentation";
import { buildCommand } from "../utils/command";
import { MainCommand } from "../models/main-command";
import { CommandOptionConfig, cmdOption } from "../models/options";
import { commandName, commandsMap } from ".";

export class HelpCommand extends Command {
  protected readonly doc: CommandDocumentation = {
    name: `help`,
    usage: `[command name]`,
    description: `display usage info`,
    details: `
If supplied a command name, then show the associated documentation.
If supplied "all" as the command name, then show the documentation of every command.    
If the command name is not provided, or does not exists, then show the main documentation.`,
    options: new Map<string, CommandOptionConfig>([
      [
        `markdown`,
        {
          type: `boolean`,
          description: `format output using markdown instead of plain text`
        }
      ],
      [
        `to`,
        {
          type: `string`,
          description: `save usage info in the supplied directory`,
          defaultDescription: `stdout`
        }
      ]
    ])
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  async run(
    [cmdName]: [commandName | `all`],
    options: Map<string, cmdOption>
  ): Promise<void> {
    let message = `no help available for this`;
    log.silly(`help`, cmdName || `none`);
    const isMd = options.get(`markdown`) as boolean;
    if (cmdName === `all`) {
      log.error(`--all`, `not implemented yet`);
    } else if (cmdName && [...commandsMap.keys()].includes(cmdName)) {
      message = buildCommand(cmdName).help(isMd);
    } else {
      message = new MainCommand().help(isMd);
    }
    const saveTo = options.get(`to`) as string;
    if (saveTo && existsSync(saveTo)) {
      log.error(`--to`, `not implemented yet`);
    } else {
      output(message);
    }
  }
}
