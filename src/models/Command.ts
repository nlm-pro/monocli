import { optionType, option } from "./options";
import { SubProject } from "./SubProject";

export class CommandOptionError extends Error {
  constructor(public optionName: string | string[], message?: string) {
    super(message);
  }
}

export interface CommandOptionConfig {
  type: optionType;
  description: string;
  mandatory: boolean;
}

export abstract class Command {
  protected static usage: string;
  protected static description: string;
  protected readonly options: Map<string, CommandOptionConfig>;
  protected singleMandatoryOptions: Map<string, CommandOptionConfig>;

  constructor(public readonly name: string) {}

  protected get mandatoryOptions(): Map<string, CommandOptionConfig> {
    if (!this.singleMandatoryOptions) {
      this.singleMandatoryOptions = new Map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [...this.options].filter(([name, config]) => config.mandatory)
      );
    }

    return this.singleMandatoryOptions;
  }

  validate(options: Map<string, option>): void {
    const mandatoryOptionsPile = this.mandatoryOptions;
    for (const [optionName, optionConfig] of this.options) {
      if (optionConfig.mandatory) {
        if (!options.has(optionName)) {
          throw new CommandOptionError(optionName, `missing mandatory option`);
        }
      } else {
        mandatoryOptionsPile.delete(optionName);
      }

      if (typeof options.get(optionName) !== optionConfig.type) {
        throw new CommandOptionError(optionName, `invalid type provided`);
      }
    }
    if (mandatoryOptionsPile.size > 0) {
      throw new CommandOptionError(
        [...mandatoryOptionsPile.keys()],
        `missing mandatory options`
      );
    }
  }

  abstract help(): string;
  abstract run(
    subProject: SubProject | SubProject[],
    options: Map<string, option>
  ): string;
}
