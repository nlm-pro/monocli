import { Project } from "./Project";

export interface Config {
  projects: Project[];
}

export interface ConfigDescriptor {
  config: Config;
  filePath: string;
}
