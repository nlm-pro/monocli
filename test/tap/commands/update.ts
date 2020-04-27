import * as path from "path";
import * as fs from "fs-extra";
import * as t from "tap";
import * as prompts from "prompts";
import {
  makeGitRepo,
  testDir,
  run,
  commitNewFile,
  graphLog,
  fileSnapshot,
  cleanSnapshot
} from "../../common";
import { Config, SubProjectConfig } from "../../../src/models/config";
import { relativeTo } from "../../../src/utils/path";
import { Monorepo } from "../../../src/models/monorepo";
import { Repository } from "../../../src/models/git";

const subproject: SubProjectConfig = {
  scope: `proj`,
  directory: `subproj`
};

prompts.inject([false]);

async function setup(
  dir: string,
  withUrl: boolean,
  conflict = false
): Promise<{ mainRepo: Repository; subRepo: Repository }> {
  const root = path.resolve(testDir, dir);
  await fs.mkdir(root);

  const subRepoDir = path.resolve(root, `sub`);
  const mainRepoDir = path.resolve(root, `main`);

  await fs.mkdir(subRepoDir);

  await fs.mkdir(mainRepoDir);

  const config: Config = {
    projects: [subproject]
  };

  if (withUrl) {
    config.projects[0].url = relativeTo(subRepoDir, mainRepoDir);
  }

  await fs.writeFile(
    path.resolve(mainRepoDir, Monorepo.CONFIG_FILE_NAME),
    JSON.stringify(config, null, 2)
  );

  const mainRepo = await makeGitRepo({
    root: mainRepoDir,
    added: [Monorepo.CONFIG_FILE_NAME],
    message: `feat(root): initial commit before add`
  });
  const subRepo = await makeGitRepo({ root: subRepoDir, bare: true });

  await commitNewFile(
    subRepo,
    `README.md`,
    `feat(${subproject.scope}): in remote before add`
  );

  await run([`add`, subproject.directory, subRepo.path], mainRepo.path);

  await commitNewFile(
    mainRepo,
    path.join(subproject.directory, `foo.txt`),
    `feat(${subproject.scope}): in root after add`
  );

  await commitNewFile(mainRepo, `README.md`, `docs(root): README after add`);

  if (conflict) {
    await commitNewFile(
      subRepo,
      `test.txt`,
      `feat(${subproject.scope}): in remote after add`
    );
  }

  return {
    mainRepo,
    subRepo
  };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`update command`, async t => {
  await t.test(`without remote url`, async t => {
    const { mainRepo, subRepo } = await setup(`remote`, false);

    const output = await run([`update`, subproject.directory], mainRepo.path);

    t.matchSnapshot(cleanSnapshot(output), `output`);

    t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

    t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

    t.matchSnapshot(
      await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
      `updated config`
    );
  });

  await t.test(`with url argument`, async t => {
    await t.test(`without conflict`, async t => {
      const { mainRepo, subRepo } = await setup(`arg`, false);

      const output = await run(
        [`update`, subproject.directory, subRepo.path],
        mainRepo.path
      );

      t.matchSnapshot(cleanSnapshot(output), `output`);

      t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

      t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

      t.matchSnapshot(
        await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
        `updated config`
      );
    });

    await t.test(`with conflict`, async t => {
      await t.test(`should pull`, async t => {
        const { mainRepo, subRepo } = await setup(`conflict`, false, true);

        prompts.inject([false]);

        const output = await run(
          [`update`, subproject.directory, subRepo.path],
          mainRepo.path
        );

        t.matchSnapshot(cleanSnapshot(output), `output`);

        t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

        t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

        t.matchSnapshot(
          await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
          `updated config`
        );
      });

      await t.test(`--trust`, async t => {
        const { mainRepo, subRepo } = await setup(`trust`, false, true);

        const output = await run(
          [`update`, subproject.directory, subRepo.path, `--trust`],
          mainRepo.path
        );

        t.matchSnapshot(cleanSnapshot(output), `output`);

        t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

        t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

        t.matchSnapshot(
          await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
          `updated config`
        );
      });

      await t.test(`new branch`, async t => {
        const { mainRepo, subRepo } = await setup(`new-branch`, false, true);

        const output = await run(
          [`update`, subproject.directory, subRepo.path, `test-branch`],
          mainRepo.path
        );

        t.matchSnapshot(cleanSnapshot(output), `output`);

        t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

        t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

        t.matchSnapshot(
          await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
          `updated config`
        );
      });
    });
  });

  await t.test(`with url in config and argument`, async t => {
    const { mainRepo, subRepo } = await setup(`config-arg`, true);

    const output = await run(
      [`update`, subproject.directory, relativeTo(subRepo.path, mainRepo.path)],
      mainRepo.path
    );
    t.matchSnapshot(cleanSnapshot(output), `output`);

    t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

    t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

    t.matchSnapshot(
      await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
      `updated config`
    );
  });

  await t.test(`with url in config`, async t => {
    const { mainRepo, subRepo } = await setup(`config`, true);

    const output = await run([`update`, subproject.directory], mainRepo.path);
    t.matchSnapshot(cleanSnapshot(output), `output`);

    t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

    t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

    t.matchSnapshot(
      await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
      `updated config`
    );
  });
});
