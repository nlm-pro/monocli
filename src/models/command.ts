import { resolve } from "path";
import { cmdOption, CommandOptionConfig, cmdOptionValueFn } from "./options";
import { CommandDocumentation } from "./documentation";
import { CommandOptionError } from "./errors";

const indent = {
  option: {
    start: 2,
    name: 10,
    details: 9
  }
};

const optionToString = (
  name: string,
  {
    type,
    description,
    defaultValue,
    defaultDescription,
    details
  }: CommandOptionConfig
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

  const padName = name.padEnd(indent.option.name);
  const padType = typeStr.padEnd(indent.option.details);

  let msg = `--${padName}  ${padType}  ${description}  ${defaultStr}`;

  if (details) {
    const formattedDetails = details
      .split(`\n`)
      .map(
        line => ` `.repeat(indent.option.start + indent.option.name - 2) + line
      )
      .join(`\n`);

    msg = `${msg}

${formattedDetails}

    `;
  }

  return msg;
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
      (prev, [name, config]) =>
        `${prev}\n${` `.repeat(indent.option.start)}${optionToString(
          name,
          config
        )}`,
      `${` `.repeat(indent.option.start)}${optionToString(...firstOption)}`
    );
  }

  abstract async run(
    params?: string[],
    options?: Map<string, cmdOption>
  ): Promise<string | void>;
}
