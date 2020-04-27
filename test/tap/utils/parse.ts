import { test } from "tap";
import { parse } from "../../../src/utils/parse";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test(`parse()`, t => {
  const parsed = parse([`cmd`, `--foo=bar`, `-b`, `--baz`, `--num=42`]);
  t.same(parsed[0], [`cmd`], `command name`);
  t.equal(parsed[1].get(`foo`), `bar`, `foo=bar option`);
  t.equal(parsed[1].get(`b`), true, `short boolean option`);
  t.equal(parsed[1].get(`baz`), true, `long boolean option`);
  t.equal(parsed[1].get(`num`), 42, `numeric option`);
  t.end();
});
