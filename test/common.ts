import * as stream from "stream";
import * as path from "path";
import * as fs from "fs-extra";
import * as log from "npmlog";
import { teardown } from "tap";
import { spawn as asyncSpawn, Output } from "promisify-child-process";
import { commandName } from "../src/commands";
import { Repository } from "../src/models/git";
import { run as runCommand } from "../src/index";
import { chdir } from "../src/utils/fs";
import * as Logger from "../src/utils/log";

if (typeof require.main === `undefined`) {
  throw new Error(`not a tap test`);
}

export const logs: string[] = [];

const debugStream = new stream.Writable({
  write: (chunk, encoding, next): void => {
    logs.push(chunk);
    next();
  }
});

(log as any).stream = debugStream;

const main = require.main.filename;
const testName = path.basename(main, `.ts`);
export const testDir = path.resolve(path.dirname(main), testName);

fs.removeSync(testDir);
fs.mkdirpSync(testDir);

// TODO: refactor global settings
chdir(testDir);
Logger.init(`silly`);

const returnCwd = path.dirname(__dirname);

teardown(() => {
  process.on(`exit`, () => {
    // work around windows folder locking
    process.chdir(returnCwd);
    try {
      if (!process.env.NO_TEST_CLEANUP) {
        fs.removeSync(testDir);
      }
    } catch (e) {
      if (process.platform !== `win32`) {
        throw e;
      }
    }
  });
});

export const nodeBin = process.env.NODE || process.execPath;

// eslint-disable-next-line quotes
export const bin = require.resolve("../bin/monocli");

export function runBin(
  cmd: commandName,
  args: string[] = [],
  cwd = testDir
): Promise<Output> {
  return asyncSpawn(nodeBin, [bin, cmd, ...args], { encoding: `utf8`, cwd });
}

export async function run(args: string[], root = testDir): Promise<string> {
  const result: string[] = [];
  const wStream = new stream.Writable({
    write: (chunk, encoding, next): void => {
      result.push(chunk);
      next();
    }
  });

  await runCommand(args, root, wStream);

  return result.join(``).trim();
}

export async function makeGitRepo({
  root = testDir,
  user = `TestFaker`,
  email = `nope@not.real`,
  added = [] as string[],
  message = `stub repo`,
  bare = false
} = {}): Promise<Repository> {
  const repo = new Repository(root);
  await repo.git(`init`, bare ? [`--bare`] : []);
  await repo.git(`config`, [`user.name`, user]);
  await repo.git(`config`, [`user.email`, email]);
  // don't time out tests waiting for a gpg passphrase or 2fa
  await repo.git(`config`, [`tag.gpgSign`, `false`]);
  await repo.git(`config`, [`tag.forceSignAnnotated`, `false`]);
  if (added.length > 0) {
    await repo.git(`add`, added);
    await repo.git(`commit`, [`-m`, message]);
  }

  return repo;
}

export async function graphLog(repository: Repository): Promise<string> {
  let commits = `NONE`;
  try {
    commits = await repository.git(`log`, [
      `--graph`,
      `--all`,
      `--pretty=format:'%d %s'`
    ]);
    commits = commits.replace(/(["'])/g, ``);
  } catch (e) {
    commits = `ERROR: ${e}`;
  }

  return commits;
}

export interface TestRepo {
  repo: Repository;
  path: string;
}
