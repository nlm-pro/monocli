import * as path from "path";
import * as fs from "fs-extra";
import * as t from "tap";
import * as prompts from "prompts";
import {
  makeGitRepo,
  testDir,
  run,
  TestRepo,
  commitNewFile,
  cleanSnapshot
} from "../../common";
import { Config, SubProjectConfig } from "../../../src/models/config";
import { relativeTo } from "../../../src/utils/path";
import { Monorepo } from "../../../src/models/monorepo";

interface TestFiles {
  main: TestRepo;
  sub: TestRepo;
}

const subproject: SubProjectConfig = {
  scope: `proj`,
  directory: `subproj`
};

async function setup(
  dir: string,
  withUrl: boolean,
  conflict = false
): Promise<TestFiles> {
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
    added: [Monorepo.CONFIG_FILE_NAME]
  });
  const subRepo = await makeGitRepo({ root: subRepoDir, bare: true });

  if (conflict) {
    await commitNewFile(subRepo, `README.md`);
  }

  // TODO: use Add command

  await fs.createFile(
    path.resolve(mainRepoDir, subproject.directory, `foo.txt`)
  );
  await mainRepo.git(`add`, [`${subproject.directory}/foo.txt`]);
  await mainRepo.git(`commit`, [`-m`, `feat(${subproject.scope}): foo.txt`]);

  await fs.createFile(path.resolve(mainRepoDir, `README.md`));
  await mainRepo.git(`add`, [`README.md`]);
  await mainRepo.git(`commit`, [`-m`, `docs: README`]);

  return {
    main: { repo: mainRepo, path: mainRepoDir },
    sub: { repo: subRepo, path: subRepoDir }
  };
}

async function assert(output: string, testFiles: TestFiles): Promise<void> {
  t.matchSnapshot(output, `output`);
  t.matchSnapshot(
    await testFiles.main.repo.git(`log`, [`--format=%B`]),
    `monorepo commits`
  );
  let subrepoLog: string;
  try {
    subrepoLog = await testFiles.sub.repo.git(`log`, [`--format=%B`]);
  } catch (e) {
    subrepoLog = e;
  }
  t.matchSnapshot(subrepoLog, `subrepo commits`);

  t.matchSnapshot(
    fs.readFileSync(
      path.resolve(testFiles.main.path, Monorepo.CONFIG_FILE_NAME),
      `utf8`
    ),
    `updated config`
  );
}

t.test(`spush command`, async t => {
  await t.test(`without remote url`, async t => {
    const testFiles = await setup(`remote`, false);

    const output = await run(
      [`spush`, subproject.directory],
      testFiles.main.path
    );
    await assert(output, testFiles);

    t.end();
  });

  await t.test(`with url argument`, async t => {
    await t.test(`without conflict`, async t => {
      const testFiles = await setup(`arg`, false);

      const output = await run(
        [`spush`, subproject.directory, testFiles.sub.path],
        testFiles.main.path
      );
      await assert(output, testFiles);

      t.end();
    });

    await t.test(`with conflict`, async t => {
      await t.test(`do nothing`, async t => {
        const testFiles = await setup(`conflict`, false, true);

        prompts.inject([false]);

        const output = await run(
          [`spush`, subproject.directory, testFiles.sub.path],
          testFiles.main.path
        );

        t.matchSnapshot(cleanSnapshot(output), `ouput`);
      });

      await t.test(`new branch`, async t => {
        const testFiles = await setup(`new-branch`, false, true);

        const output = await run(
          [
            `spush`,
            subproject.directory,
            testFiles.sub.path,
            `--branch`,
            `test-branch`
          ],
          testFiles.main.path
        );

        t.matchSnapshot(cleanSnapshot(output), `output`);
      });
    });
  });

  await t.test(`with url in config and argument`, async t => {
    const testFiles = await setup(`config-arg`, true);

    const output = await run(
      [
        `spush`,
        subproject.directory,
        relativeTo(testFiles.sub.path, testFiles.main.path)
      ],
      testFiles.main.path
    );
    await assert(output, testFiles);

    t.end();
  });

  await t.test(`with url in config`, async t => {
    const testFiles = await setup(`config`, true);

    const output = await run(
      [`spush`, subproject.directory],
      testFiles.main.path
    );
    await assert(output, testFiles);

    t.end();
  });
});
