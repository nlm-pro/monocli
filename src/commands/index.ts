import { StatusCommand } from "./status";
import { MvCommand } from "./mv";
import { HelpCommand } from "./help";
import { UpdateCommand } from "./update";
import { SPushCommand } from "./spush";
import { CheckCommand } from "./check";
import { AddCommand } from "./add";
import { SPullCommand } from "./spull";

export type commandName =
  | `status`
  | `mv`
  | `help`
  | `spull`
  | `spush`
  | `update`
  | `check`
  | `add`;

export type typesOfCommand =
  | typeof StatusCommand
  | typeof MvCommand
  | typeof HelpCommand
  | typeof UpdateCommand
  | typeof SPushCommand
  | typeof SPullCommand
  | typeof CheckCommand
  | typeof AddCommand;

export const commandsMap: Map<commandName, typesOfCommand> = new Map([
  [`status`, StatusCommand],
  [`mv`, MvCommand],
  [`help`, HelpCommand],
  [`update`, UpdateCommand],
  [`spush`, SPushCommand],
  [`spull`, SPullCommand],
  [`check`, CheckCommand],
  [`add`, AddCommand]
] as [commandName, typesOfCommand][]);

export {
  StatusCommand,
  MvCommand,
  HelpCommand,
  UpdateCommand,
  SPushCommand,
  SPullCommand,
  CheckCommand,
  AddCommand
};
