import { Monorepo } from "./monorepo";
import { Command } from "./command";

export abstract class MonorepoCommand extends Command {
  protected monorepo: Monorepo;

  setMonorepo(monorepo: Monorepo): void {
    if (this.monorepo === null) {
      throw new Error(`can't set command monorepo multiple times`);
    }
    this.monorepo = monorepo;
  }
}
