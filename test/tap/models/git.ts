import { resolve } from "path";
import { test } from "tap";
import * as fs from "fs-extra";
import { Submodule } from "../../../src/models/git";
import { testDir, makeGitRepo, TestRepo } from "../../common";

async function setupSubmodules(
  dir: string
): Promise<{
  testRepo: TestRepo;
  submodules: {
    config: Map<string, Submodule>;
    testRepos: Map<string, TestRepo>;
  };
}> {
  const root = resolve(testDir, dir);
  const testRepoPath = resolve(root, `mono`);
  await fs.mkdirp(testRepoPath);
  const submodulesConfig: Map<string, Submodule> = new Map(
    [`one`, `two`, `three`].map(name => [
      `submodules/${name}`,
      {
        name,
        url: `../${name}`
      }
    ])
  );

  const repo = await makeGitRepo({ root: testRepoPath });
  const testSubmodulesRepos: Map<string, TestRepo> = new Map();
  for (const [path, submodule] of submodulesConfig) {
    const repoPath = resolve(root, submodule.name);
    await fs.mkdir(repoPath);
    await fs.createFile(resolve(repoPath, `hello.txt`));
    const submoduleRepo = await makeGitRepo({
      root: repoPath,
      added: [`hello.txt`]
    });
    await repo.git(`submodule`, [
      `add`,
      `--name`,
      submodule.name,
      submodule.url,
      path
    ]);

    testSubmodulesRepos.set(submodule.name, { path, repo: submoduleRepo });
  }

  await repo.git(`add`, [`-A`]);
  await repo.git(`commit`, [`-m`, `submodules`]);

  return {
    testRepo: {
      repo,
      path: testRepoPath
    },
    submodules: {
      config: submodulesConfig,
      testRepos: testSubmodulesRepos
    }
  };
}

test(`git`, async t => {
  await t.test(`Repository`, async t => {
    await t.test(`getSubmodules()`, async t => {
      const { testRepo, submodules } = await setupSubmodules(`get-submodules`);
      t.same(await testRepo.repo.getSubmodules(), submodules.config);
    });

    await t.test(`deleteSubmodule()`, async t => {
      const { testRepo, submodules } = await setupSubmodules(`del-submodules`);
      await testRepo.repo.deleteSubmodule(`submodules/one`);
      submodules.config.delete(`submodules/one`);
      t.same(
        await testRepo.repo.getSubmodules(),
        submodules.config,
        `remove from .gitmodules`
      );
      t.false(
        fs.existsSync(resolve(testRepo.path, `submodules/one`)),
        `delete directory`
      );
    });
  });
});
