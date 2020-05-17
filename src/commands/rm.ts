import { existsSync } from "fs-extra";
import { silly, notice } from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { relativeTo, absolute } from "../utils/path";
import { CommandOptionError } from "../models/errors";
import { Monorepo } from "../models/monorepo";

export class RmCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `rm`,
    usage: `<path>`,
    description: `delete a subproject`,
    details: `delete the <path> directory along with the related submodule and the monocli subproject configurations if needed`,
    options: new Map()
  };

  async run([path]: [string]): Promise<string | void> {
    if (!path) {
      throw new CommandOptionError(
        `parameters`,
        `missing parameter: ${this.doc.usage}`
      );
    }
    if (!existsSync(absolute(path))) {
      throw new CommandOptionError(
        `path`,
        `${absolute(path)} directory does not exist`
      );
    }

    silly(`path`, path);
    const directory = relativeTo(path, this.monorepo.root.path);

    const oldProjectConfig = this.monorepo.rmProjectConfig(
      `directory`,
      directory
    );
    if (oldProjectConfig === null) {
      notice(``, `no project config for ${directory}`);
    }
    await this.monorepo.repository.git(`add`, [Monorepo.CONFIG_FILE_NAME]);

    const submodules = await this.monorepo.repository.getSubmodules();
    const submodule = submodules.get(directory);

    if (submodule) {
      await this.monorepo.repository.deleteSubmodule(directory);
    } else {
      await this.monorepo.repository.git(`rm`, [`-r`, directory]);
      await this.monorepo.repository.git(`commit`, [
        `-m`,
        `chore: delete ${directory}`
      ]);
    }

    notice(``, `${directory} successfully removed`);
  }
}
