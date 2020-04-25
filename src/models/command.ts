import { resolve } from "path";
import { cmdOption, CommandOptionConfig, cmdOptionValueFn } from "./options";
import { CommandDocumentation } from "./documentation";
import { CommandOptionError } from "./errors";

const optionToString = (
  name: string,
  { type, description, defaultValue, defaultDescription }: CommandOptionConfig
): string => {
  // TODO: dash-case name
  let defaultStr = type === `string` ? `"${defaultValue}"` : defaultValue;
  defaultStr =
    typeof defaultValue !== `undefined`
      ? `(default: ${defaultDescription || defaultStr})`
      : type === `boolean`
      ? `(default: false)`
      : ``;
  const typeStr = `<${type}>`;

  return `--${name.padEnd(10)}  ${typeStr.padEnd(
    9
  )}  ${description}  ${defaultStr}`;
};

export abstract class Command {
  protected readonly tmpDir = resolve(`/tmp`, `monorepo`);
  private singleMandatoryOptions: Map<string, CommandOptionConfig>;

  protected abstract readonly doc: CommandDocumentation;

  constructor(protected isInteractive: boolean = false) {}

  protected get mandatoryOptions(): Map<string, CommandOptionConfig> {
    if (!this.singleMandatoryOptions) {
      this.singleMandatoryOptions = new Map(
        [...this.doc.options].filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([name, config]) =>
            config.type !== `boolean` &&
            typeof config.defaultValue === `undefined`
        )
      );
    }

    return this.singleMandatoryOptions;
  }

  help(isMd = false): string {
    if (!isMd) {
      let options = this.optionsHelp;
      options = options
        ? `Options:
${options}`
        : ``;
      const optUsage = this.doc.options.size > 0 ? `[options]` : ``;
      const name = this.doc.name ? ` ${this.doc.name}` : ``;

      return `
Usage: monocli${name} ${this.doc.usage} ${optUsage}

${this.doc.description}
${this.doc.details}

${options}
    `;
    } else {
      throw new CommandOptionError(`markdown`, `not implemented yet`);
    }
  }

  validate(
    params: string[],
    options: Map<string, cmdOption>
  ): Map<string, cmdOption> {
    const rslt = new Map<string, cmdOption>();
    const derivedOptions: Array<[string, cmdOptionValueFn]> = [];
    for (const [optionName, optionConfig] of this.doc.options) {
      const value = options.get(optionName);
      if (typeof value !== `undefined`) {
        rslt.set(optionName, value);
        continue;
      }

      if (optionConfig.type === `boolean`) {
        rslt.set(optionName, false);
        continue;
      }

      if (typeof optionConfig.defaultValue === `undefined`) {
        throw new CommandOptionError(optionName, `missing mandatory option`);
      }

      if (typeof optionConfig.defaultValue !== `function`) {
        rslt.set(optionName, optionConfig.defaultValue);
      } else {
        derivedOptions.push([optionName, optionConfig.defaultValue]);
      }
    }

    derivedOptions.forEach(([optionName, defaultFn]) => {
      rslt.set(optionName, defaultFn(params, rslt));
    });

    return rslt;
  }

  private get optionsHelp(): string {
    const options = [...this.doc.options];
    const firstOption = options.shift();

    if (typeof firstOption === `undefined`) {
      return ``;
    }

    return [...options].reduce(
      (prev, [name, config]) => `${prev}\n  ${optionToString(name, config)}`,
      `  ${optionToString(...firstOption)}`
    );
  }

  abstract async run(
    params?: string[],
    options?: Map<string, cmdOption>
  ): Promise<string | void>;
}
