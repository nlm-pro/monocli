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
*    Merge remote-tracking branch test/monocli-add-test
|\\  
| *  (test/monocli-add-test) chore(test): Move all files into packages/foo
| *  stub repo
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() remote > output 1`] = `
monocli notice you should now check everything is ok and then run the update command
`

exports[`test/tap/commands/add.ts TAP add command run() rewrite > commits 1`] = `
*  (HEAD -> master) build: add monocli config for packages/foo
*    Merge remote-tracking branch test/monocli-add-test
|\\  
| *  (test/monocli-add-test) chore(test): Move all files into packages/foo
| *  chore(test): stub repo
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() rewrite > output 1`] = `
chore(test): stub repo
chore(test): Move all files into packages/foo
monocli notice you should now check everything is ok and then run the update command
`

exports[`test/tap/commands/add.ts TAP add command run() with submodule with url option > commits 1`] = `
*  (HEAD -> master) build: add monocli config for packages/subproject
*    Merge remote-tracking branch subproject/monocli-add-subproject
|\\  
| *  (subproject/monocli-add-subproject) chore(subproject): Move all files into packages/subproject
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
*    Merge remote-tracking branch subproject/monocli-add-subproject
|\\  
| *  (subproject/monocli-add-subproject) chore(subproject): Move all files into packages/subproject
| *  stub repo
*  chore: delete submodule at packages/subproject
*  submodule
*  stub repo
`

exports[`test/tap/commands/add.ts TAP add command run() with submodule without url option > output 1`] = `
monocli notice you should now check everything is ok and then run the update command
`
