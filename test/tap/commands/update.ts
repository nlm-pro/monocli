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
  conflict = false,
  multipleSubrepo = false
): Promise<{ mainRepo: Repository; subRepos: Repository[] }> {
  const root = path.resolve(testDir, dir);
  await fs.mkdir(root);

  const mainRepoDir = path.resolve(root, `main`);

  await fs.mkdir(mainRepoDir);

  const mainRepo = await makeGitRepo({
    root: mainRepoDir
  });

  await commitNewFile(
    mainRepo,
    `one.txt`,
    `feat(root): initial commit before add`
  );

  const config: Config = {
    projects: multipleSubrepo
      ? [`sub1`, `sub2`, `sub3`].map(name => ({ directory: name, scope: name }))
      : [subproject]
  };

  const subRepos = [];
  for (const project of config.projects) {
    const subRepoDir = path.resolve(root, project.scope);
    await fs.mkdir(subRepoDir);

    if (withUrl && !multipleSubrepo) {
      config.projects[0].url = relativeTo(subRepoDir, mainRepoDir);
    }

    const subRepo = await makeGitRepo({ root: subRepoDir, bare: true });

    await commitNewFile(
      subRepo,
      `README.md`,
      `feat(${project.scope}): in remote before add`
    );

    await run([`add`, project.directory, `--url`, subRepo.path], mainRepo.path);

    await commitNewFile(
      mainRepo,
      path.join(project.directory, `two.txt`),
      `feat(${project.scope}): in root after add`
    );

    if (conflict) {
      await commitNewFile(
        subRepo,
        `test.txt`,
        `feat(${project.scope}): in remote after add`
      );
    }

    subRepos.push(subRepo);
  }

  await commitNewFile(mainRepo, `README.md`, `docs(root): README after add`);

  return {
    mainRepo,
    subRepos
  };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`update command`, async t => {
  await t.test(`without remote url`, async t => {
    const {
      mainRepo,
      subRepos: [subRepo]
    } = await setup(`remote`, false);

    const output = await run([`update`, subproject.directory], mainRepo.path);

    t.matchSnapshot(cleanSnapshot(output), `output`);

    t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

    t.matchSnapshot(await graphLog(subRepo), `subrepo commits`);

    t.matchSnapshot(
      await fileSnapshot(mainRepo.path, Monorepo.CONFIG_FILE_NAME),
      `updated config`
    );
  });

  await t.test(`without directory argument`, async t => {
    const { mainRepo, subRepos } = await setup(`nodir`, false, false, true);

    const output = await run([`update`], mainRepo.path);

    t.matchSnapshot(cleanSnapshot(output), `output`);

    t.matchSnapshot(await graphLog(mainRepo), `monorepo commits`);

    for (const subRepo of subRepos) {
      t.matchSnapshot(
        await graphLog(subRepo),
        `subrepo ${path.basename(subRepo.path)} commits`
      );
    }
  });

  await t.test(`with url argument`, async t => {
    await t.test(`without conflict`, async t => {
      const {
        mainRepo,
        subRepos: [subRepo]
      } = await setup(`arg`, false);

      const output = await run(
        [`update`, subproject.directory, `--url`, subRepo.path],
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
        const {
          mainRepo,
          subRepos: [subRepo]
        } = await setup(`conflict`, false, true);

        prompts.inject([false]);

        const output = await run(
          [`update`, subproject.directory, `--url`, subRepo.path],
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
        const {
          mainRepo,
          subRepos: [subRepo]
        } = await setup(`trust`, false, true);

        const output = await run(
          [`update`, subproject.directory, `--url`, subRepo.path, `--trust`],
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
        const {
          mainRepo,
          subRepos: [subRepo]
        } = await setup(`new-branch`, false, true);

        const output = await run(
          [
            `update`,
            subproject.directory,
            `--url`,
            subRepo.path,
            `--branch`,
            `test-branch`
          ],
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
    const {
      mainRepo,
      subRepos: [subRepo]
    } = await setup(`config-arg`, true);

    const output = await run(
      [
        `update`,
        subproject.directory,
        `--url`,
        relativeTo(subRepo.path, mainRepo.path)
      ],
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
    const {
      mainRepo,
      subRepos: [subRepo]
    } = await setup(`config`, true);

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
