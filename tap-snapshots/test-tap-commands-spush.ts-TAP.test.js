/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/spush.ts TAP spush command with url argument with conflict --force > output 1`] = `
monocli WARN git Push to [[TEST DIRECTORY]]/tap/commands/spush/force/sub master branch failed!
monocli notice branch master saved on [[TEST DIRECTORY]]/tap/commands/spush/force/sub as save-master
monocli notice local changes successfully pushed to [[TEST DIRECTORY]]/tap/commands/spush/force/sub/master
`

exports[`test/tap/commands/spush.ts TAP spush command with url argument with conflict do nothing > ouput 1`] = `
monocli WARN git Push to [[TEST DIRECTORY]]/tap/commands/spush/conflict/sub master branch failed!

monocli ERR! Go to [[TMP DIRECTORY]]/[[TIMESTAMP]] in order to resolve this conflict.
`

exports[`test/tap/commands/spush.ts TAP spush command with url argument with conflict new branch > output 1`] = `
monocli notice subtree subproj pushed to [[TEST DIRECTORY]]/tap/commands/spush/new-branch/sub
`

exports[`test/tap/commands/spush.ts TAP spush command with url argument without conflict > monorepo commits 1`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/spush.ts TAP spush command with url argument without conflict > output 1`] = `
monocli notice subtree subproj pushed to /home/noel/git/me/monocli/test/tap/commands/spush/arg/sub
`

exports[`test/tap/commands/spush.ts TAP spush command with url argument without conflict > subrepo commits 1`] = `
feat(proj): foo.txt
`

exports[`test/tap/commands/spush.ts TAP spush command with url argument without conflict > updated config 1`] = `
{
  "projects": [
    {
      "scope": "proj",
      "directory": "subproj"
    }
  ]
}
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config > monorepo commits 1`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config > output 1`] = `
monocli notice subtree subproj pushed to /home/noel/git/me/monocli/test/tap/commands/spush/config/sub
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config > subrepo commits 1`] = `
feat(proj): foo.txt
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config > updated config 1`] = `
{
  "projects": [
    {
      "scope": "proj",
      "directory": "subproj",
      "url": "../sub"
    }
  ]
}
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config and argument > monorepo commits 1`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config and argument > output 1`] = `
monocli notice subtree subproj pushed to /home/noel/git/me/monocli/test/tap/commands/spush/config-arg/sub
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config and argument > subrepo commits 1`] = `
feat(proj): foo.txt
`

exports[`test/tap/commands/spush.ts TAP spush command with url in config and argument > updated config 1`] = `
{
  "projects": [
    {
      "scope": "proj",
      "directory": "subproj",
      "url": "../sub"
    }
  ]
}
`

exports[`test/tap/commands/spush.ts TAP spush command without remote url > monorepo commits 1`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/spush.ts TAP spush command without remote url > output 1`] = `
monocli ERR! url no remote url was given for subproj
`

exports[`test/tap/commands/spush.ts TAP spush command without remote url > subrepo commits 1`] = `
Error: fatal: your current branch 'master' does not have any commits yet {
  "code": 128,
}
`

exports[`test/tap/commands/spush.ts TAP spush command without remote url > updated config 1`] = `
{
  "projects": [
    {
      "scope": "proj",
      "directory": "subproj"
    }
  ]
}
`
