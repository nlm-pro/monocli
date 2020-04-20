import * as log from "npmlog";
import { commandName, commandsMap, HelpCommand } from "../commands";
import { Command } from "../models/command";
import { MonorepoCommand } from "../models/monorepo-command";
import { Monorepo } from "../models/monorepo";

export function buildCommand(cmdName: commandName, from?: string): Command {
  let possibleCommand = commandsMap.get(cmdName);
  if (!possibleCommand) {
    log.warn(cmdName, `unknown command`);
    possibleCommand = HelpCommand;
  }
  const command = new possibleCommand();
  if (command instanceof MonorepoCommand) {
    command.setMonorepo(new Monorepo(from));
  }

  return command;
}
