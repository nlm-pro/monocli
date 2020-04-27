// eslint-disable-next-line quotes
import t = require("tap");
import { run, makeGitRepo } from "../../common";

async function setup(): Promise<void> {
  await makeGitRepo();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`status command`, async () => {
  await setup();
  t.matchSnapshot(await run([`status`]), `without options`);
});
