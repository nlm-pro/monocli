import { StatusCommand } from "./status";
import { MvCommand } from "./mv";
import { HelpCommand } from "./help";
import { UpdateCommand } from "./update";
import { CheckCommand } from "./check";

export type commandName = `status` | `mv` | `help` | `update` | `check`;
export type typesOfCommand =
  | typeof StatusCommand
  | typeof MvCommand
  | typeof HelpCommand
  | typeof UpdateCommand
  | typeof CheckCommand;

export const commandsMap: Map<commandName, typesOfCommand> = new Map([
  [`status`, StatusCommand],
  [`mv`, MvCommand],
  [`help`, HelpCommand],
  [`update`, UpdateCommand],
  [`check`, CheckCommand]
] as [commandName, typesOfCommand][]);

export { StatusCommand, MvCommand, HelpCommand, UpdateCommand, CheckCommand };
