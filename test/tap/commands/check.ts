/* eslint-disable quotes */
import t = require("tap");
import * as path from "path";
import * as fs from "fs-extra";
import { run, testDir, makeGitRepo, runBin } from "../../common";
import { ExitError } from "../../../src/models/errors";
/* eslint-enable quotes */

t.test(`check command`, async t => {
  await t.test(`released`, async t => {
    const root = path.resolve(testDir, `released`);
    const project = `subproj`;
    await fs.mkdirp(path.resolve(root, project));

    await fs.createFile(path.join(root, `foo.txt`));
    const repo = await makeGitRepo({ root, added: [`foo.txt`] });
    await repo.git(`tag`, [`-a`, `v0.1.0`, `-m`, `v0.1.0`]);
    await fs.createFile(path.resolve(root, project, `bar.txt`));
    await repo.git(`add`, [path.join(project, `bar.txt`)]);
    await repo.git(`commit`, [`-m`, `feat(project): bar`]);
    await repo.git(`tag`, [`-a`, `v0.2.0`, `-m`, `v0.2.0`]);

    const promise = run([`check`, `subproj`], root);

    // FIXME: typing
    t.rejects(
      promise,
      new ExitError(
        `check failed: last version of subproj has already been released`,
        [`v0.2.0`]
      )
    );

    let binError;

    try {
      await runBin(`check`, [`subproj`], root);
    } catch (e) {
      binError = e;
    }

    t.equal(binError.code, 1, `bin exit code`);

    const output = await run([`check`, project, `--tag`, `v1.0.0`], root);

    t.matchSnapshot(output, `tag option - output`);
  });

  await t.test(`not released`, async t => {
    const root = path.resolve(testDir, `not-released`);
    const project = `subproj`;
    await fs.mkdirp(path.resolve(root, project));

    await fs.createFile(path.join(root, `foo.txt`));
    const repo = await makeGitRepo({ root, added: [`foo.txt`] });
    await repo.git(`tag`, [`-a`, `v0.1.0`, `-m`, `v0.1.0`]);
    await fs.createFile(path.resolve(root, project, `bar.txt`));
    await repo.git(`add`, [path.join(project, `bar.txt`)]);
    await repo.git(`commit`, [`-m`, `feat(project): bar`]);

    const output = await run([`check`, project], root);

    t.matchSnapshot(output, `output`);

    const { stderr } = await runBin(`check`, [project], root);

    t.matchSnapshot(stderr, `bin output`);

    t.end();
  });
});
