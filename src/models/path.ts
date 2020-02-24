import { isAbsolute, resolve, relative } from "path";
import { readdir } from "fs-extra";
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
  const content = await readdir(absolute(path));
  silly(`isEmpty`, `content: %s`, content);

  return content.length === 0;
}
