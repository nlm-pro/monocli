import * as stream from "stream";
import * as rimraf from "rimraf";
import * as mkdirp from "mkdirp";
import { teardown } from "tap";
// eslint-disable-next-line quotes
import path = require("path");
import { spawn, ChildProcessPromise } from "promisify-child-process";
import { commandName } from "../src/commands";
import { Repository } from "../src/models/git";
import { run as runCommand } from "../src/index";
import { chdir } from "../src/utils/path";
import * as Logger from "../src/utils/log";

if (typeof require.main === `undefined`) {
  throw new Error(`not a tap test`);
}

const main = require.main.filename;
const testName = path.basename(main, `.ts`);
export const testDir = path.resolve(path.dirname(main), testName);

rimraf.sync(testDir);
mkdirp.sync(testDir);

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
        rimraf.sync(testDir);
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
  args: string[] = []
): ChildProcessPromise {
  return spawn(nodeBin, [bin, cmd, ...args], { encoding: `utf8` });
}

export async function run(args: string[]): Promise<string> {
  const result: string[] = [];
  const wStream = new stream.Writable({
    write: (chunk, encoding, next): void => {
      result.push(chunk);
      next();
    }
  });

  await runCommand(args, testDir, wStream);

  return result.join(``).trim();
}

export async function makeGitRepo({
  root = testDir,
  user = `TestFaker`,
  email = `nope@not.real`,
  added = [],
  message = `stub repo`
} = {}): Promise<Repository> {
  const repo = new Repository(root);
  await repo.git(`init`);
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
