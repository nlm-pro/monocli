// eslint-disable-next-line quotes
import t = require("tap");
import { run, makeGitRepo } from "../../common";

async function setup(): Promise<void> {
  await makeGitRepo();
}

t.test(`status command`, async () => {
  await setup();
  t.matchSnapshot(await run([`status`]), `without options`);
  t.end();
});
