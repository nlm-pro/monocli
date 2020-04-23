import { test } from "tap";
import * as log from "npmlog";
import { init, debug } from "../../../src/utils/log";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test(`logs init()`, t => {
  init(`silent`);
  t.true(
    log.levels.http <
      log.levels.explain <
      log.levels.output <
      log.levels.run <
      log.levels.notice,
    `levels order`
  );
  t.equal(log.heading, `monocli`, `heading`);
  t.equal(debug, false, `debug false by default`);
  init(`silly`);
  t.equal(debug, true, `debug when silly`);
  t.end();
});
