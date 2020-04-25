import { StatusCommand } from "./status";
import { MvCommand } from "./mv";
import { HelpCommand } from "./help";
import { SPushCommand } from "./spush";
import { CheckCommand } from "./check";
import { AddCommand } from "./add";

export type commandName = `status` | `mv` | `help` | `spush` | `check` | `add`;
export type typesOfCommand =
  | typeof StatusCommand
  | typeof MvCommand
  | typeof HelpCommand
  | typeof SPushCommand
  | typeof CheckCommand
  | typeof AddCommand;

export const commandsMap: Map<commandName, typesOfCommand> = new Map([
  [`status`, StatusCommand],
  [`mv`, MvCommand],
  [`help`, HelpCommand],
  [`spush`, SPushCommand],
  [`check`, CheckCommand],
  [`add`, AddCommand]
] as [commandName, typesOfCommand][]);

export {
  StatusCommand,
  MvCommand,
  HelpCommand,
  SPushCommand,
  CheckCommand,
  AddCommand
};
