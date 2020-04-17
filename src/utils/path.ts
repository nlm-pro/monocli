import { join, dirname, parse, isAbsolute, resolve, relative } from "path";
import * as fs from "fs-extra";
import { cwd } from "./fs";

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
