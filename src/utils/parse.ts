import * as log from "npmlog";
import { cmdOption } from "../models/options";
import { minimist } from "./minimist";

export function parse(args: string[]): [string[], Map<string, cmdOption>] {
  const parsedArgs = minimist(args);
  const params = parsedArgs._ as string[];
  delete parsedArgs._;
  const options = new Map(
    Object.entries(parsedArgs as { [s: string]: cmdOption })
  );
  log.silly(`params`, params.join(`, `));
  log.silly(`options`, JSON.stringify(parsedArgs));

  return [params, options];
}
