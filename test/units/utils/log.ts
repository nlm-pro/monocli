import { test } from "tap";
import { init, debug } from "../../../src/utils/log";
// eslint-disable-next-line quotes
import log = require("npmlog");

test(`logs init()`, t => {
  init(`silent`);
  t.equal(log.levels.git, 1900, `git level`);
  t.equal(log.heading, `monocli`, `heading`);
  t.equal(debug, false, `debug false by default`);
  init(`silly`);
  t.equal(debug, true, `debug when silly`);
  t.end();
});
