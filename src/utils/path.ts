import { join, dirname, parse, isAbsolute, resolve, relative } from "path";
import * as fs from "fs-extra";
import { silly } from "npmlog";

export function relativeTo(path: string, root: string): string {
  if (!isAbsolute(path)) {
    path = resolve(process.cwd(), path);
  }

  return relative(root, path);
}

export function absolute(path: string): string {
  if (isAbsolute(path)) {
    return path;
  }

  return resolve(process.cwd(), path);
}

export async function isEmpty(path: string): Promise<boolean> {
  const content = await fs.readdir(absolute(path));
  silly(`isEmpty`, `content: %s`, content);

  return content.length === 0;
}

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
