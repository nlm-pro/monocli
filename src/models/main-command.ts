import { Writable } from "stream";
import { remove, ensureDir } from "fs-extra";
import { buildCommand } from "../utils/command";
import { commandName, commandsMap } from "../commands";
import { cwd } from "../utils/fs";
import { setDryMode } from "../utils/child-process";
import * as Logging from "../utils/log";
import * as prompt from "../utils/prompt";
import { CommandDocumentation } from "./documentation";
import { cmdOption, CommandOptionConfig } from "./options";
import { Command } from "./command";

export class MainCommand extends Command {
  protected readonly doc: CommandDocumentation = {
    name: ``,
    usage: `<command>`,
    description: `One CLI to rule them all.`,
    details: `
Easy monorepos management, and more.

Commands: ${[...commandsMap.keys()].join(`, `)}

Use 'monocli help <command name>' for more information about one of these commands.`,
    options: new Map<string, CommandOptionConfig>([
      [
        `debug`,
        {
          type: `boolean`,
          description: `enable debug mode (set log level to "silly")`
        }
      ],
      [
        `trust`,
        {
          type: `boolean`,
          description: `run non-interactively (by default answer to all prompts)`
        }
      ],
      [
        `dry`,
        {
          type: `boolean`,
          description: `only run commands without any effect`
        }
      ],
      [
        `explain`,
        {
          type: `boolean`,
          description: `print commands, explanations & outputs`
        }
      ],
      [
        `show`,
        {
          type: `boolean`,
          description: `print commands & their output`
        }
      ]
    ])
  };

  constructor(private output: Writable | undefined) {
    super(true);
  }

  async run(
    params: string[],
    options: Map<string, cmdOption>
  ): Promise<string | void> {
    const mainOptions = this.validate(params, options);
    const logLevel = mainOptions.get(`debug`)
      ? `silly`
      : mainOptions.get(`show`)
      ? `output`
      : mainOptions.get(`explain`)
      ? `explain`
      : `notice`;
    Logging.init(logLevel, this.output);
    prompt.setOutput(this.output || process.stdout);

    setDryMode(mainOptions.get(`dry`) as boolean);

    const cmdName = params[0] as commandName;
    const subCommandParams = params.slice(1);
    const command = buildCommand(cmdName, cwd(), true);
    const mainCommandOptions = this.validate(params, options);

    let subCommandOptions = new Map([...options]);
    for (const [optionName] of this.doc.options) {
      subCommandOptions.delete(optionName);
    }

    subCommandOptions = command.validate(subCommandParams, subCommandOptions);

    await remove(this.tmpDir);
    await ensureDir(this.tmpDir);

    return command.run(
      subCommandParams,
      new Map([...mainCommandOptions.entries(), ...subCommandOptions.entries()])
    );
  }
}
