import { silly, notice } from "npmlog";
import { getProject } from "../utils/config";
import { absolute } from "../utils/path";
import { Monorepo } from "./monorepo";
import { Command } from "./command";
import { SubProjectConfig } from "./config";
import { CommandOptionError } from "./errors";

export interface ProjectRemoteInformation {
  /**
   * scope or timestamp
   */
  id: string;
  /**
   * remote repository url
   */
  remoteUrl: string;
}

export abstract class MonorepoCommand extends Command {
  protected monorepo: Monorepo;

  setMonorepo(monorepo: Monorepo): void {
    if (this.monorepo === null) {
      throw new Error(`can't set command monorepo multiple times`);
    }
    this.monorepo = monorepo;
  }

  /**
   * Get project's remote repository information
   *
   * @param directory - path to project's directory (relative to the monorepo root)
   * @param url - remote url option
   *
   *   fallback if no other remote url could be found for `directory`
   *   if it's not empty, `url` will override any submodule `url`
   *
   * @throws {@link CommandOptionError} if `url` conflicts with the monocli config or no url can be used
   */
  getProjectRemote(directory: string, url: string): ProjectRemoteInformation {
    let projectConfig: SubProjectConfig | null = null;

    try {
      const config = this.monorepo.getConfig();
      projectConfig = getProject(config, `directory`, directory);
      if (projectConfig) {
        silly(`config`, `project: %s`, projectConfig);
      }
    } catch (e) {
      notice(``, `no project config available for ${directory}`);
    }

    if (projectConfig?.url && url && projectConfig?.url !== url) {
      throw new CommandOptionError(
        `url`,
        `a different url is defined for ${directory} in ${Monorepo.CONFIG_FILE_NAME}: ${projectConfig.url}`
      );
    }

    if (!projectConfig?.url && !url) {
      throw new CommandOptionError(
        `url`,
        `no remote url was given for ${directory}`
      );
    }

    let remoteUrl = projectConfig?.url || url;
    if (/^\.\.?\/?/.exec(remoteUrl)) {
      remoteUrl = absolute(remoteUrl);
    }

    let id = `${+new Date()}`;
    if (projectConfig?.scope) {
      id = projectConfig.scope.concat(`-${id}`);
    }

    return {
      id,
      remoteUrl
    };
  }
}
