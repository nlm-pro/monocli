/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/spull.ts TAP spull command with directory and url > commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
| *  feat: add file after add
* |  build: add monocli config for packages/foo
* |  Add packages/foo/ from commit [[COMMIT HASH]]
|\\| 
| *  (foo/monocli-add-foo, foo/master) docs: add README before add
*  initial commit
`

exports[`test/tap/commands/spull.ts TAP spull command with directory and url > output 1`] = `
monocli notice packages/foo pulled [[TEST DIRECTORY]]/tap/commands/spull/opts/remote
`

exports[`test/tap/commands/spull.ts TAP spull command without directory > commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
| *  feat: add file after add
* |    Merge commit [[COMMIT HASH]]
|\\ \\  
| * |  feat: add file after add
* | |  build: add monocli config for packages/bar
* | |    Add packages/bar/ from commit [[COMMIT HASH]]
|\\ \\ \\  
| | |/  
| |/|   
| * |  (bar/monocli-add-bar, bar/master) docs: add README before add
|  /  
* |  build: add monocli config for packages/foo
* |  Add packages/foo/ from commit [[COMMIT HASH]]
|\\| 
| *  (foo/monocli-add-foo, foo/master) docs: add README before add
*  initial commit
`

exports[`test/tap/commands/spull.ts TAP spull command without directory > output 1`] = `
monocli notice packages/foo pulled [[TEST DIRECTORY]]/tap/commands/spull/all/remote-foo
monocli notice packages/bar pulled [[TEST DIRECTORY]]/tap/commands/spull/all/remote-bar
`
