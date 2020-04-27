import * as log from "npmlog";
import { commandName, commandsMap, HelpCommand } from "../commands";
import { Command } from "../models/command";
import { MonorepoCommand } from "../models/monorepo-command";
import { Monorepo } from "../models/monorepo";
import { cmdOption } from "../models/options";
import { InternalError } from "../models/errors";

export function buildCommand(
  cmdName: commandName,
  from?: string,
  isInteractive = false
): Command {
  let possibleCommand = commandsMap.get(cmdName);
  if (!possibleCommand) {
    if (!isInteractive) {
      throw new InternalError(`could not find command ${cmdName}`);
    }

    log.warn(cmdName, `unknown command`);
    possibleCommand = HelpCommand;
  }
  const command = new possibleCommand(isInteractive);
  if (command instanceof MonorepoCommand) {
    command.setMonorepo(new Monorepo(from));
  }

  return command;
}

// TODO: generic in order to correctly type params
export async function runCommand(
  cmdName: commandName,
  params: string[],
  options: Map<string, cmdOption> = new Map(),
  from?: string
): Promise<string | void> {
  const cmd = buildCommand(cmdName, from, false);
  const cmdOptions = cmd.validate(params, options);

  return cmd.run(params, cmdOptions);
}
