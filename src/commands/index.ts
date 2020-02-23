import { StatusCommand } from "./status";
import { MvCommand } from "./mv";
import { HelpCommand } from "./help";

export type commandName = `status` | `mv` | `help`;
export type typesOfCommand =
  | typeof StatusCommand
  | typeof MvCommand
  | typeof HelpCommand;

export const commandsMap: Map<commandName, typesOfCommand> = new Map([
  [`status`, StatusCommand],
  [`mv`, MvCommand],
  [`help`, HelpCommand]
] as [commandName, typesOfCommand][]);

export { StatusCommand, MvCommand, HelpCommand };
