import { join, dirname, parse } from "path";
import * as fs from "fs-extra";

export function findUp(name: string, from: string): string | null {
  const root = parse(from).root;

  let currentDir = from;
  while (currentDir && currentDir !== root) {
    const possiblePath = join(currentDir, name);
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }

    currentDir = dirname(currentDir);
  }

  return null;
}
