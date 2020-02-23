import { SubProjectConfig, Config } from "../models/config";
import { MonorepoError } from "../models/monorepo";

export function getProject(
  config: Config,
  by: keyof SubProjectConfig,
  value: string
): SubProjectConfig {
  const possibleConfig = config.projects.find(
    projectConfig => projectConfig[by] === value
  );
  if (typeof possibleConfig === `undefined`) {
    throw new MonorepoError(`no project with ${by}: ${value}`);
  }

  return possibleConfig;
}
