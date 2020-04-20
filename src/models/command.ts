import { resolve } from "path";
import { cmdOption, CommandOptionConfig } from "./options";
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

  get help(): string {
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
  }

  validate(params: string[], options: Map<string, cmdOption>): void {
    const mandatoryOptionsPile = this.mandatoryOptions;
    for (const [optionName, optionConfig] of this.doc.options) {
      if (typeof optionConfig.defaultValue !== `undefined`) {
        if (!options.has(optionName)) {
          throw new CommandOptionError(optionName, `missing mandatory option`);
        }
        if (
          typeof optionConfig.defaultValue === `function` &&
          !options.has(optionName)
        ) {
          options.set(optionName, optionConfig.defaultValue(params, options));
        }
      } else {
        mandatoryOptionsPile.delete(optionName);
      }

      if (
        options.has(optionName) &&
        typeof options.get(optionName) !== optionConfig.type
      ) {
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
