// eslint-disable-next-line quotes
import t = require("tap");
import { run } from "../common";

t.test(`help command`, async () => {
  t.matchSnapshot(await run([`help`]), `main`);
  t.matchSnapshot(await run([`help`, `mv`]), `mv`);
  t.matchSnapshot(await run([`help`, `status`]), `status`);
  t.matchSnapshot(await run([`help`, `update`]), `status`);
  t.matchSnapshot(await run([`help`, `help`]), `help`);
  t.matchSnapshot(await run([`help`, `foo`]), `unknown command name`);
  t.end();
});
