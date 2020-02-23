export interface SubProjectConfig {
  scope: string;
  directory: string;
  url?: string;
}

export interface Config {
  projects: SubProjectConfig[];
}
