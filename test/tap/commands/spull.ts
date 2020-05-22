import * as path from "path";
import * as t from "tap";
import * as fs from "fs-extra";
import {
  makeGitRepo,
  testDir,
  commitNewFile,
  cleanSnapshot,
  graphLog,
  run
} from "../../common";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`spull command`, async t => {
  await t.test(`with directory and url`, async t => {
    const directory = `packages/foo`;
    const root = path.resolve(testDir, `opts`);

    const remoteRepo = await makeGitRepo({
      root: path.resolve(root, `remote`),
      bare: true
    });

    await commitNewFile(remoteRepo, `README.md`, `docs: add README before add`);
    const monodir = path.resolve(root, `mono`);
    await fs.mkdirp(monodir);
    fs.createFileSync(path.resolve(monodir, `mono.cool`));
    const monorepo = await makeGitRepo({
      root: path.resolve(root, `mono`),
      added: [`mono.cool`],
      message: `initial commit`
    });
    await run([`add`, directory, `--url`, remoteRepo.path], monorepo.path);
    await commitNewFile(remoteRepo, `foo.txt`, `feat: add file after add`);

    const output = await run(
      [`spull`, directory, `--url`, remoteRepo.path],
      monorepo.path
    );

    t.matchSnapshot(cleanSnapshot(output), `output`);
    t.matchSnapshot(cleanSnapshot(await graphLog(monorepo)), `commits`);
  });

  await t.test(`without directory`, async t => {
    const root = path.resolve(testDir, `all`);

    const monodir = path.resolve(root, `mono`);

    await fs.mkdirp(monodir);

    fs.createFileSync(path.resolve(monodir, `mono.cool`));
    const monorepo = await makeGitRepo({
      root: path.resolve(root, `mono`),
      added: [`mono.cool`],
      message: `initial commit`
    });

    const directories = [`packages/foo`, `packages/bar`];

    for (const dir of directories) {
      const remoteRepo = await makeGitRepo({
        root: path.resolve(root, `remote-${path.basename(dir)}`),
        bare: true
      });

      await commitNewFile(
        remoteRepo,
        `README.md`,
        `docs: add README before add`
      );
      await run([`add`, dir, `--url`, remoteRepo.path], monorepo.path);
      await commitNewFile(remoteRepo, `foo.txt`, `feat: add file after add`);
    }

    const output = await run([`spull`], monorepo.path);

    t.matchSnapshot(cleanSnapshot(output), `output`);
    t.matchSnapshot(cleanSnapshot(await graphLog(monorepo)), `commits`);
  });
});
