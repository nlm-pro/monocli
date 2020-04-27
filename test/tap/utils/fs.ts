import { resolve } from "path";
import { test } from "tap";
import * as fs from "fs-extra";
import { ensureNotEmptyDir } from "../../../src/utils/fs";
import { testDir } from "../../common";

/* eslint-disable @typescript-eslint/no-floating-promises */

test(`fs utils`, t => {
  t.test(`ensureNotEmptyDir()`, t => {
    t.test(`empty directory`, t => {
      const emptyDir = resolve(testDir, `empty`);
      fs.mkdirpSync(emptyDir);
      ensureNotEmptyDir(emptyDir);
      t.true(fs.existsSync(resolve(emptyDir, `.gitkeep`)), `create file`);
      t.end();
    });

    t.test(`not existing directory`, t => {
      const notExistingDir = resolve(testDir, `not-existing`);
      ensureNotEmptyDir(notExistingDir);
      t.true(fs.existsSync(notExistingDir), `create directory`);
      t.true(fs.existsSync(resolve(notExistingDir, `.gitkeep`)), `create file`);
      t.end();
    });

    t.test(`not empty directory`, t => {
      const notEmptyDir = resolve(testDir, `not-empty`);
      fs.mkdirpSync(notEmptyDir);
      fs.createFileSync(resolve(notEmptyDir, `hello.txt`));
      ensureNotEmptyDir(notEmptyDir);
      t.false(
        fs.existsSync(resolve(notEmptyDir, `.gitkeep`)),
        `don't create file`
      );
      t.end();
    });

    t.end();
  });

  t.end();
});
