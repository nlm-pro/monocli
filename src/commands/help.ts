import * as log from "npmlog";
import { Command } from "../models/command";
import { output } from "../utils/log";
import { CommandDocumentation } from "../models/documentation";
import { buildCommand } from "../utils/command";
import { MainCommand } from "../models/main-command";
import { commandName, commandsMap } from ".";

export class HelpCommand extends Command {
  protected readonly doc: CommandDocumentation = {
    name: `help`,
    usage: `[command name]`,
    description: `display usage info`,
    details: `
If supplied a command name, then show the associated documentation.
    
If the command name is not provided, or does not exist, then show the main documentation.`,
    options: new Map()
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  async run([cmdName]: [commandName]): Promise<void> {
    let message = `no help available for this`;
    log.silly(`help`, cmdName || `none`);
    if (cmdName && [...commandsMap.keys()].includes(cmdName)) {
      message = buildCommand(cmdName).help;
    } else {
      message = new MainCommand(process.stdout).help;
    }
    output(message);
  }
}
