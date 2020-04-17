import { parse, join, dirname } from "path";
import { silly } from "npmlog";
import * as fs from "fs-extra";
import { absolute } from "./path";

let workingDirectory: string;

export function cwd(): string {
  if (workingDirectory) {
    return workingDirectory;
  }
  throw new Error(`no working directory defined`);
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

export function ensureNotEmptyDir(pathToDir: string): void {
  fs.ensureDirSync(pathToDir);
  const content = fs.readdirSync(pathToDir);
  if (content.length === 0) {
    fs.createFileSync(join(pathToDir, `.gitkeep`));
  }
}
