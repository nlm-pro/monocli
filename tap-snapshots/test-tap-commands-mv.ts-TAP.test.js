/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/mv.ts TAP mv command with remote > must match snapshot 1`] = `
*    (HEAD -> monocli-mv-one) Merge commit [[COMMIT HASH]] into monocli-mv-one
|\\  
| *  Squashed new-one/ changes from [[COMMIT HASH]]..[[COMMIT HASH]]
* |  Split new-one/ into commit [[COMMIT HASH]]
|\\| 
* |  build: mv one via monocli
* |  (master) feat(two): bar.txt
* |  feat(one): foo.txt
* |  stub repo
 /  
| *  (monocli-spush-one-[[TIMESTAMP]]) Merge commit [[COMMIT HASH]] into monocli-mv-one
|/| 
| *  (monocli-spush-one-[[TIMESTAMP]]) feat(one): foo.txt
*  build: mv one via monocli
`

exports[`test/tap/commands/mv.ts TAP mv command with remote > output 1`] = `
monocli notice files moved
monocli notice commit files renaming
monocli notice commit config update
monocli notice subtree successfully updated
monocli notice remote subrepo successfully updated
`

exports[`test/tap/commands/mv.ts TAP mv command without remote > commits 1`] = `
build: mv one via monocli

update project directory in monocli config after mv
from one to three

feat(two): bar.txt

feat(one): foo.txt

stub repo
`

exports[`test/tap/commands/mv.ts TAP mv command without remote > output 1`] = `
monocli notice files moved
monocli notice commit files renaming
monocli notice commit config update
monocli notice no remote url in this project config
`

exports[`test/tap/commands/mv.ts TAP mv command without remote > updated config 1`] = `
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
