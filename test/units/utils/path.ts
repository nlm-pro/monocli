import { join } from "path";
import { test } from "tap";
import { relativeTo, absolute } from "../../../src/utils/path";

test(`relativeTo()`, t => {
  t.equal(relativeTo(`/foo`, `/bar`), `../foo`);
  t.equal(relativeTo(`foo`, `/bar`), join(`..`, process.cwd(), `foo`));
  t.equal(relativeTo(`foo`, `bar`), `../foo`);
  t.end();
});

test(`absolute()`, t => {
  t.equal(absolute(`/foo`), `/foo`);
  t.equal(absolute(`foo`), join(process.cwd(), `foo`));
  t.end();
});
