import { join } from "path";
import { test } from "tap";
import { relativeTo, absolute, chdir, cwd } from "../../../src/utils/path";
import { testDir } from "../../common";

function setup(): void {
  chdir(testDir);
}

test(`relativeTo()`, t => {
  setup();
  t.equal(relativeTo(`/foo`, `/bar`), `../foo`, `two absolutes`);
  t.equal(
    relativeTo(`foo`, `/bar`),
    join(`..`, cwd(), `foo`),
    `relative to absolutes`
  );
  t.equal(relativeTo(`foo`, `bar`), `../foo`, `relative to relative`);
  t.end();
});

test(`absolute()`, t => {
  setup();
  t.equal(absolute(`/foo`), `/foo`, `absolute doesn't change`);
  t.equal(absolute(`foo`), join(cwd(), `foo`), `relative`);
  t.end();
});
