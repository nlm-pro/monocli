import { Logger } from "../utils/logger";
import { Monorepo } from "./Monorepo";

export class CommandMonorepo extends Monorepo {
  constructor(private command: AbstractCommand) {
    super();
  }

  branchName(action: string): string {
    return `monopm-${this.command.name}-${action}`;
  }
}

export abstract class AbstractCommand {
  protected monorepo = new CommandMonorepo(this);

  constructor(protected log: Logger, public name: string) {}

  exit(message: string, error: Error | string, code: number): void {
    this.log.error(message);
    this.log.error(error);
    process.exit(code);
  }
}
