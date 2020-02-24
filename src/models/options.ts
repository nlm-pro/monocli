export type cmdOptionType = `boolean` | `string` | `number`;
export type cmdOption = boolean | string | number;

export interface CommandOptionConfig {
  type: cmdOptionType;
  description: string;
  defaultValue?: cmdOptionType;
}
