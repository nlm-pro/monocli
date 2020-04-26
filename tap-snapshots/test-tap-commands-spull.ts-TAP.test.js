/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/spull.ts TAP spull command > commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
| *  feat: add file after add
* |  build: add monocli config for packages/foo
* |  Add packages/foo/ from commit [[COMMIT HASH]]
|\\| 
| *  (foo/monocli-add-foo, foo/master) docs: add README before add
*  initial commit
`

exports[`test/tap/commands/spull.ts TAP spull command > output 1`] = `
monocli notice success local directory packages/foo successfully updated from [[TEST DIRECTORY]]/tap/commands/spull/remote
`
