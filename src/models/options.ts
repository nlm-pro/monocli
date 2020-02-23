export type cmdOptionType = `boolean` | `string` | `number`;
export type cmdOption = boolean | string | number;

export class CommandOptionError extends Error {
  constructor(public optionName: string | string[], message?: string) {
    super(message);
  }
}

export interface CommandOptionConfig {
  type: cmdOptionType;
  description: string;
  defaultValue?: cmdOptionType;
}
