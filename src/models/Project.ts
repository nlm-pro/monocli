export const projectKeys: (keyof Project)[] = [`name`, `url`, `directory`];

export interface Project {
  name?: string;
  url?: string;
  directory?: string;
}
