import * as path from "path";
import * as fs from "fs-extra";
// eslint-disable-next-line quotes
import t = require("tap");
import { makeGitRepo, testDir, run } from "../common";
import { Config } from "../../src/models/config";
import { Repository } from "../../src/models/git";
import { Monorepo } from '../../src/models/monorepo';

t.test(`mv command`, async t => {
  t.test(`without remote`, async t => {
    async function setup(): Promise<Repository> {
      await fs.writeFile(
        path.resolve(testDir, Monorepo.CONFIG_FILE_NAME),
        JSON.stringify(
          {
            projects: [
              {
                scope: `one`,
                directory: `one`
              },
              {
                scope: `two`,
                directory: `two`
              }
            ]
          } as Config,
          null,
          2
        )
      );

      const repo = await makeGitRepo({ added: [Monorepo.CONFIG_FILE_NAME] });

      await fs.createFile(path.resolve(testDir, `one/foo.txt`));
      await repo.git(`add`, [`one/foo.txt`]);
      await repo.git(`commit`, [`-m`, `feat(one): foo.txt`]);
      await fs.createFile(path.resolve(testDir, `two/bar.txt`));
      await repo.git(`add`, [`two/bar.txt`]);
      await repo.git(`commit`, [`-m`, `feat(two): bar.txt`]);

      return repo;
    }

    const repo = await setup();

    const output = await run([`mv`, `one`, `three`]);
    const commits = await repo.git(`log`, [`--format=%B`]);

    t.matchSnapshot(commits, `commits`);
    t.matchSnapshot(output, `output`);
    t.equal(
      await fs.pathExists(path.resolve(testDir, `one`)),
      false,
      `remove old folder`
    );
    t.same(
      await fs.pathExists(path.resolve(testDir, `three`, `foo.txt`)),
      true,
      `move to new folder`
    );
    t.matchSnapshot(
      fs.readFileSync(path.resolve(testDir, Monorepo.CONFIG_FILE_NAME), `utf8`),
      `updated config`
    );

    t.end();
  });
});
