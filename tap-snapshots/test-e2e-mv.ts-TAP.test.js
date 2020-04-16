/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/e2e/mv.ts TAP mv command without remote > commits 1`] = `
build: mv one via monocli

update project directory in monocli config after mv
from one to three

chore: mv one to three

feat(two): bar.txt

feat(one): foo.txt

stub repo
`

exports[`test/e2e/mv.ts TAP mv command without remote > output 1`] = `
monocli notice files moved
monocli notice commit files renaming
monocli notice commit config update
monocli notice no remote url in this project config
`

exports[`test/e2e/mv.ts TAP mv command without remote > updated config 1`] = `
{
  "projects": [
    {
      "scope": "one",
      "directory": "three"
    },
    {
      "scope": "two",
      "directory": "two"
    }
  ]
}
`
