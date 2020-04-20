export type cmdOptionType = `boolean` | `string` | `number`;
export type cmdOption = boolean | string | number;

export type cmdOptionValueFn = (
  params: string[],
  options?: Map<string, cmdOption>
) => cmdOption;
export interface CommandOptionConfig {
  type: cmdOptionType;
  description: string;
  defaultValue?: cmdOption | cmdOptionValueFn;
  defaultDescription?: string;
}
