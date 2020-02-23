import { Monorepo } from "../models/Monorepo";
import { StatusCommand } from "../commands/status";
import { Command } from "../models/Command";

export class BuildCommandError extends Error {
  constructor(public cmdName: string, message?: string) {
    super(message);
  }
}

export function buildCommand(cmdName: string) {
  let command: Command;
  const monorepo = new Monorepo();
  // TODO: subproject

  // TODO: make more generic by setting a "commandClazz" and then calling its constructor
  switch (cmdName) {
    case `status`:
      command = new StatusCommand(monorepo);
      break;
    default:
      throw new BuildCommandError(`this command isn't supported`);
  }

  return command;
}
