/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/add.ts TAP add command run() empty > must match snapshot 1`] = `
*  (HEAD -> master) build: add monocli config for packages/foo
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() empty > output 1`] = `
monocli notice project added to configuration
`

exports[`test/tap/commands/add.ts TAP add command run() remote > commits 1`] = `
*  (HEAD -> master) build: add monocli config for packages/foo
*    Add packages/foo/ from commit [[COMMIT HASH]]
|\\  
| *  (test/monocli-add-test, test/master) chore(test/foo): baz
| *  feat(#1): bar
| *  stub repo
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() remote > output 1`] = `
monocli notice you should now check everything is ok and then run the update command
`

exports[`test/tap/commands/add.ts TAP add command run() rewrite --trust > output 1`] = `
monocli notice you should now check everything is ok and then run the update command
`

exports[`test/tap/commands/add.ts TAP add command run() rewrite > commits 1`] = `
*  (HEAD -> master) build: add monocli config for packages/foo
*    Add packages/foo/ from commit [[COMMIT HASH]]
|\\  
| *  (test/monocli-add-test) chore(test): baz
| *  feat(test): bar
| *  chore(test): stub repo
*  stub repo
*  (test/master) chore(test/foo): baz
*  feat(#1): bar
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() rewrite > commits 2`] = `
*  (HEAD -> master) build: add monocli config for packages/foo
*    Add packages/foo/ from commit [[COMMIT HASH]]
|\\  
| *  (test/monocli-add-test) chore(test): baz
| *  feat(test): bar
| *  chore(test): stub repo
*  stub repo
*  (test/master) chore(test/foo): baz
*  feat(#1): bar
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() rewrite interactive > output 1`] = `
chore(test): stub repo
feat(test): bar
chore(test): baz
monocli notice you should now check everything is ok and then run the update command
`

exports[`test/tap/commands/add.ts TAP add command run() with submodule with url option > commits 1`] = `
*  (HEAD -> master) build: add monocli config for packages/subproject
*    Add packages/subproject/ from commit [[COMMIT HASH]]
|\\  
| *  (subproject/monocli-add-subproject, subproject/master) chore(test/foo): baz
| *  feat(#1): bar
| *  stub repo
*  chore: delete submodule at packages/subproject
*  submodule
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() with submodule with url option > output 1`] = `
monocli WARN submodule existing submodule deleted
monocli notice you should now check everything is ok and then run the update command
`

exports[`test/tap/commands/add.ts TAP add command run() with submodule without url option > commits 1`] = `
*  (HEAD -> master) build: add monocli config for packages/subproject
*    Add packages/subproject/ from commit [[COMMIT HASH]]
|\\  
| *  (subproject/monocli-add-subproject, subproject/master) chore(test/foo): baz
| *  feat(#1): bar
| *  stub repo
*  chore: delete submodule at packages/subproject
*  submodule
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() with submodule without url option > output 1`] = `
monocli notice you should now check everything is ok and then run the update command
`
