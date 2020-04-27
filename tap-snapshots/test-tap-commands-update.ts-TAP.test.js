/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/update.ts TAP update command with url argument with conflict --trust > monorepo commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
* |  docs(root): README after add
* |  feat(proj): in root after add
* |  build: add monocli config for subproj
* |    Add subproj/ from commit [[COMMIT HASH]]
|\\ \\  
* | |  feat(root): initial commit before add
 / /  
| | *    (monocli-spush-subproj-[[TIMESTAMP]]) Merge commit [[COMMIT HASH]]
| | |\\  
| | |/  
| |/|   
| * |  feat(proj): in remote after add
|/ /  
| *  (monocli-spush-subproj-[[TIMESTAMP]]) feat(proj): in root after add
|/  
*  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict --trust > output 1`] = `
monocli WARN spush push to subtree remote failed
monocli notice spull pulling from subtree remote
monocli notice success local directory subproj successfully updated from [[TEST DIRECTORY]]/tap/commands/update/trust/sub
monocli notice remote subrepo successfully updated
monocli notice subproj updated
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict --trust > subrepo commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
| *  feat(proj): in remote after add
* |  feat(proj): in root after add
|/  
*  (monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict --trust > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/trust/sub"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict new branch > monorepo commits 1`] = `
*  (HEAD -> master) docs(root): README after add
*  feat(proj): in root after add
*  build: add monocli config for subproj
*    Add subproj/ from commit [[COMMIT HASH]]
|\\  
* |  feat(root): initial commit before add
 /  
| *  (monocli-spush-subproj-[[TIMESTAMP]]) feat(proj): in root after add
|/  
*  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict new branch > output 1`] = `
monocli notice remote subrepo successfully updated
monocli notice subproj updated
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict new branch > subrepo commits 1`] = `
*  (HEAD -> master) feat(proj): in remote after add
| *  (test-branch) feat(proj): in root after add
|/  
*  (monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict new branch > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/new-branch/sub"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict should pull > monorepo commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
* |  docs(root): README after add
* |  feat(proj): in root after add
* |  build: add monocli config for subproj
* |    Add subproj/ from commit [[COMMIT HASH]]
|\\ \\  
* | |  feat(root): initial commit before add
 / /  
| | *    (monocli-spush-subproj-[[TIMESTAMP]]) Merge commit [[COMMIT HASH]]
| | |\\  
| | |/  
| |/|   
| * |  feat(proj): in remote after add
|/ /  
| *  (monocli-spush-subproj-[[TIMESTAMP]]) feat(proj): in root after add
|/  
*  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict should pull > output 1`] = `
monocli WARN spush push to subtree remote failed
monocli notice spull pulling from subtree remote
monocli notice success local directory subproj successfully updated from [[TEST DIRECTORY]]/tap/commands/update/conflict/sub
monocli notice remote subrepo successfully updated
monocli notice subproj updated
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict should pull > subrepo commits 1`] = `
*    (HEAD -> master) Merge commit [[COMMIT HASH]]
|\\  
| *  feat(proj): in remote after add
* |  feat(proj): in root after add
|/  
*  (monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument with conflict should pull > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/conflict/sub"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP update command with url argument without conflict > monorepo commits 1`] = `
*  (HEAD -> master) docs(root): README after add
*  feat(proj): in root after add
*  build: add monocli config for subproj
*    Add subproj/ from commit [[COMMIT HASH]]
|\\  
* |  feat(root): initial commit before add
 /  
| *  (monocli-spush-subproj-[[TIMESTAMP]]) feat(proj): in root after add
|/  
*  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument without conflict > output 1`] = `
monocli notice remote subrepo successfully updated
monocli notice subproj updated
`

exports[`test/tap/commands/update.ts TAP update command with url argument without conflict > subrepo commits 1`] = `
*  (HEAD -> master) feat(proj): in root after add
*  (monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url argument without conflict > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/arg/sub"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP update command with url in config > monorepo commits 1`] = `
*  (HEAD -> master) docs(root): README after add
*  feat(proj): in root after add
*  build: add monocli config for subproj
*    Add subproj/ from commit [[COMMIT HASH]]
|\\  
* |  feat(root): initial commit before add
 /  
| *  (monocli-spush-subproj-[[TIMESTAMP]]) feat(proj): in root after add
|/  
*  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url in config > output 1`] = `
monocli notice remote subrepo successfully updated
monocli notice subproj updated
`

exports[`test/tap/commands/update.ts TAP update command with url in config > subrepo commits 1`] = `
*  (HEAD -> master) feat(proj): in root after add
*  (monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url in config > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/config/sub"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP update command with url in config and argument > monorepo commits 1`] = `
*  (HEAD -> master) docs(root): README after add
*  feat(proj): in root after add
*  build: add monocli config for subproj
*    Add subproj/ from commit [[COMMIT HASH]]
|\\  
| *  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
*  feat(root): initial commit before add
`

exports[`test/tap/commands/update.ts TAP update command with url in config and argument > output 1`] = `
monocli WARN spush push to subtree remote failed
monocli notice spull pulling from subtree remote

monocli ERR! url a different url is defined for subproj in monocli.json: [[TEST DIRECTORY]]/tap/commands/update/config-arg/sub
`

exports[`test/tap/commands/update.ts TAP update command with url in config and argument > subrepo commits 1`] = `
*  (HEAD -> master, monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command with url in config and argument > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/config-arg/sub"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP update command without remote url > monorepo commits 1`] = `
*  (HEAD -> master) docs(root): README after add
*  feat(proj): in root after add
*  build: add monocli config for subproj
*    Add subproj/ from commit [[COMMIT HASH]]
|\\  
* |  feat(root): initial commit before add
 /  
| *  (monocli-spush-subproj-[[TIMESTAMP]]) feat(proj): in root after add
|/  
*  (subproj/monocli-add-subproj, subproj/master) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command without remote url > output 1`] = `
monocli notice remote subrepo successfully updated
monocli notice subproj updated
`

exports[`test/tap/commands/update.ts TAP update command without remote url > subrepo commits 1`] = `
*  (HEAD -> master) feat(proj): in root after add
*  (monocli-add-subproj) feat(proj): in remote before add
`

exports[`test/tap/commands/update.ts TAP update command without remote url > updated config 1`] = `
{
  "projects": [
    {
      "scope": "subproj",
      "directory": "subproj",
      "url": "[[TEST DIRECTORY]]/tap/commands/update/remote/sub"
    }
  ]
}
`
