import { join, dirname, parse, isAbsolute, resolve, relative } from "path";
import * as fs from "fs-extra";
import { silly } from "npmlog";

let workingDirectory: string;

export function cwd(): string {
  if (workingDirectory) {
    return workingDirectory;
  }
  throw new Error(`no working directory defined`);
}

export function absolute(path: string): string {
  if (isAbsolute(path)) {
    return path;
  }

  return resolve(cwd(), path);
}

export function relativeTo(path: string, root: string): string {
  path = absolute(path);
  root = absolute(root);

  if (!isAbsolute(root)) {
    root = resolve(cwd(), root);
  }

  return relative(root, path);
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

export function chdir(path: string): void {
  const dir = absolute(path);
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    workingDirectory = dir;
  } else {
    throw new Error(`${path} isn't a valid directory`);
  }
}
