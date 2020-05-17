/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/rm.ts TAP rm command given a submodule > commits 1`] = `
*  (HEAD -> master) chore: delete submodule at subproject
*  add submodule
*  stub repo
`

exports[`test/tap/commands/rm.ts TAP rm command given a submodule > output 1`] = `
monocli notice subproject successfully removed
`

exports[`test/tap/commands/rm.ts TAP rm command given a subproject > commits 1`] = `
*  (HEAD -> master) chore: delete subproject
*  build: add monocli config for subproject
*    Add subproject/ from commit [[COMMIT HASH]]
|\\  
| *  (subproject/monocli-add-subproject, subproject/master) subremote initial commit
*  stub repo
`

exports[`test/tap/commands/rm.ts TAP rm command given a subproject > output 1`] = `
monocli notice subproject successfully removed
`
