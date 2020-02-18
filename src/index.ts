import * as program from "commander";
import { commandRunner } from "./utils/run";
import { AddCommand } from "./commands/add";
import { CheckCommand } from "./commands/check";
import { UpdateCommand } from "./commands/update";
import { MvCommand } from "./commands/mv";

// disable simple-git logs
process.env.NODE_ENV = `production`;

program
  .description(`Monorepo (sub)Project Manager`)
  .option(`--debug`, `show debug messages`)
  .option(`--force`, `force dangerous operations (use with caution)`)
  .option(`--commit`, `commit everything (even when not absolutely necessary)`);

program
  .command(`add <path> [url]`)
  .usage(`<path> [url] [options]`)
  // TODO: find another way to show this doc
  .description(
    `add, convert or import a project to the monorepo
   
   <path>   path to the project directory
   [url]    subrepo origin url (default: submodule url or none)

Behavior depends on what the <path> directory contains and if you provided an [url] or not:
   1. if <path> is a submodule, it will be converted to a "subproject"
   2. if [url] is provided, the associated repository will be imported to the monorepo (overriding the submodule url)
   3. the project's data will be added to the configuration`
  )
  .option(
    `--name <name>`,
    `define project name and scope (default: submobule or directory name)`
  )
  .option(
    `--no-amend`,
    `do not amend commits for correction after automatic rewording`
  )
  .action(commandRunner(AddCommand));

program
  .command(`check <directory>`)
  .description(`check if <directory> has changed since the last release`)
  .option(
    `--tag <tag>`,
    `check changes since specific tag instead of the last release`
  )
  .action(commandRunner(CheckCommand));

program
  .command(`update <directory> [url]`)
  .description(`update the remote "subtree" repo associated to <directory>`)
  .action(commandRunner(UpdateCommand));

program
  .command(`mv <path> <newPath>`)
  // TODO: find another way to show this doc
  .description(
    `change a subtree prefix
  
  This command requires that <path> is associated with a existing project with an url.

${MvCommand.WARNING}
  `
  )
  .action(commandRunner(MvCommand));

program.parse(process.argv);
