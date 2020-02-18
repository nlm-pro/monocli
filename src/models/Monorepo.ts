import { resolve, dirname, relative, isAbsolute } from "path";
import * as fs from "fs-extra";
import * as simpleGit from "simple-git/promise";
import { findUp } from "../utils/path";
import { Config, ConfigDescriptor } from "./Config";
import { Project, projectKeys } from "./Project";

export class Monorepo {
  static CONFIG_FILE_NAME = `monorepo-spm.json`;

  configFilePath: string;
  private configValue: Config;

  constructor() {
    const { filePath, config } = this.getConfig(process.cwd());
    this.configFilePath = filePath;
    this.configValue = config;
  }

  get git(): simpleGit.SimpleGit {
    return simpleGit(this.rootPath);
  }

  get rootPath(): string {
    return dirname(this.configFilePath);
  }

  get config(): Config {
    return this.configValue;
  }

  get projects(): Project[] {
    return this.configValue.projects;
  }

  async addProject(data: Project): Promise<void> {
    const newProject: Project = {};

    let isEmpty = true;
    projectKeys.forEach((key: keyof Project) => {
      if (data[key] as string) {
        newProject[key] = data[key];
        isEmpty = false;
      }
    });

    if (isEmpty) {
      throw new Error(
        `This project has no parameter to store in the configuration.`
      );
    }

    let keyFound: keyof Project | undefined;
    this.projects.find(project => {
      keyFound = projectKeys.find(
        key =>
          !!project[key] &&
          !!newProject[key] &&
          project[key] === newProject[key]
      );

      return !!keyFound;
    });

    // eslint-disable-next-line id-blacklist
    if (keyFound !== undefined) {
      throw new Error(
        `there is already a project with ${keyFound} ${data[keyFound]}`
      );
    }
    this.configValue.projects.push(newProject);
    await this.saveConfig();
  }

  private getConfig(from: string): ConfigDescriptor {
    let filePath = findUp(Monorepo.CONFIG_FILE_NAME, from);
    let config;
    if (!filePath) {
      let gitRoot = findUp(`.git`, from);
      if (!gitRoot) {
        throw new Error(
          `This command requires to be run in a MonorepoSPM project, but a project definition could not be found.`
        );
      }
      gitRoot = dirname(gitRoot);
      filePath = resolve(gitRoot, Monorepo.CONFIG_FILE_NAME);
      config = { projects: [] };
      fs.writeFileSync(
        resolve(gitRoot, Monorepo.CONFIG_FILE_NAME),
        JSON.stringify(config, null, `  `),
        { encoding: `utf-8` }
      );
    }
    const configContent = fs.readFileSync(filePath, { encoding: `utf-8` });
    config = JSON.parse(configContent);

    return { config, filePath };
  }

  getProjectByPath(path: string): Project | undefined {
    const directory = this.getRelativePath(path);

    return this.config.projects.find(
      project => project.directory === directory
    );
  }

  getRelativePath(path: string): string {
    if (!isAbsolute(path)) {
      path = resolve(process.cwd(), path);
    }

    return relative(this.rootPath, path);
  }

  async updateProjectConfig(
    key: keyof Project,
    oldValue: string,
    newValue: string
  ): Promise<void> {
    const index = this.config.projects.findIndex(
      project => project[key] === oldValue
    );
    this.config.projects[index][key] = newValue;
    await this.saveConfig();
  }

  private async saveConfig(): Promise<void> {
    await fs.writeFile(
      this.configFilePath,
      JSON.stringify(this.config, null, `  `)
    );
  }
}
