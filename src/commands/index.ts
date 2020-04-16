import { StatusCommand } from "./status";
import { MvCommand } from "./mv";
import { HelpCommand } from "./help";
import { UpdateCommand } from "./update";

export type commandName = `status` | `mv` | `help` | `update`;
export type typesOfCommand =
  | typeof StatusCommand
  | typeof MvCommand
  | typeof HelpCommand
  | typeof UpdateCommand;

export const commandsMap: Map<commandName, typesOfCommand> = new Map([
  [`status`, StatusCommand],
  [`mv`, MvCommand],
  [`help`, HelpCommand],
  [`update`, UpdateCommand]
] as [commandName, typesOfCommand][]);

export { StatusCommand, MvCommand, HelpCommand, UpdateCommand };
