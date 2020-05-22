import * as path from "path";
import * as t from "tap";
import * as fs from "fs-extra";
import {
  testDir,
  makeGitRepo,
  run,
  cleanSnapshot,
  graphLog
} from "../../common";
import { Monorepo } from "../../../src/models/monorepo";
import { Repository } from "../../../src/models/git";

async function setup(
  id: string
): Promise<{ monorepo: Repository; subremote: Repository; directory: string }> {
  const root = path.resolve(testDir, id);
  await fs.mkdir(root);

  const directory = `subproject`;

  await fs.mkdir(path.join(root, `mono`));
  fs.createFileSync(path.join(root, `mono`, `README.md`));
  const monorepo = await makeGitRepo({
    root: path.join(root, `mono`),
    added: [`README.md`]
  });

  await fs.mkdir(path.join(root, `subremote`));
  fs.createFileSync(path.join(root, `subremote`, `README.md`));
  const subremote = await makeGitRepo({
    root: path.join(root, `subremote`),
    added: [`README.md`],
    message: `subremote initial commit`
  });

  return {
    monorepo,
    subremote,
    directory
  };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`rm command`, async t => {
  await t.test(`given a submodule`, async t => {
    const { monorepo, subremote, directory } = await setup(`submodule`);

    await monorepo.git(`submodule`, [
      `add`,
      `--name`,
      `subproject`,
      subremote.path,
      directory
    ]);

    await monorepo.git(`commit`, [`-am`, `add submodule`]);

    const output = await run([`rm`, directory], monorepo.path);

    t.matchSnapshot(cleanSnapshot(output), `output`);
    t.matchSnapshot(await graphLog(monorepo), `commits`);
    t.false(fs.existsSync(path.join(monorepo.path, directory)));
  });

  await t.test(`given a subproject`, async t => {
    const { monorepo, subremote, directory } = await setup(`subproject`);

    await run([`add`, directory, `--url`, subremote.path], monorepo.path);

    const output = await run([`rm`, directory], monorepo.path);

    t.matchSnapshot(cleanSnapshot(output), `output`);
    t.matchSnapshot(await graphLog(monorepo), `commits`);
    t.false(fs.existsSync(path.join(monorepo.path, directory)));
    const config = new Monorepo(monorepo.path).getConfig();
    t.same(config.projects, []);
  });
});
