export type cmdOptionType = `boolean` | `string` | `number`;

/**
 * null should only be used for optional arguments with a
 * complex "default value" defined programmatically
 */
export type cmdOption = boolean | string | number | null;

/**
 * default value derived from other arguments
 *
 * an argument default value should never be derived from an option
 * which has itself a derived default value
 */
export type cmdOptionValueFn = (
  params: string[],
  options?: Map<string, cmdOption>
) => cmdOption;

export interface CommandOptionConfig {
  type: cmdOptionType;
  description: string;
  defaultValue?: cmdOption | cmdOptionValueFn;
  defaultDescription?: string;
  details?: string;
}
