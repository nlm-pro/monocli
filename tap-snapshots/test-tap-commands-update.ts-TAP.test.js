/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/update.ts TAP > monorepo commits 1`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/update.ts TAP > monorepo commits 2`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/update.ts TAP > monorepo commits 3`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/update.ts TAP > monorepo commits 4`] = `
docs: README

feat(proj): foo.txt

stub repo
`

exports[`test/tap/commands/update.ts TAP > output 1`] = `
monocli ERR! url no remote url was given for subproj
`

exports[`test/tap/commands/update.ts TAP > output 2`] = `
monocli notice remote subrepo successfully updated
`

exports[`test/tap/commands/update.ts TAP > output 3`] = `
monocli notice remote subrepo successfully updated
`

exports[`test/tap/commands/update.ts TAP > output 4`] = `
monocli notice remote subrepo successfully updated
`

exports[`test/tap/commands/update.ts TAP > subrepo commits 1`] = `
Error: fatal: your current branch 'master' does not have any commits yet {
  "code": 128,
}
`

exports[`test/tap/commands/update.ts TAP > subrepo commits 2`] = `
feat(proj): foo.txt
`

exports[`test/tap/commands/update.ts TAP > subrepo commits 3`] = `
feat(proj): foo.txt
`

exports[`test/tap/commands/update.ts TAP > subrepo commits 4`] = `
feat(proj): foo.txt
`

exports[`test/tap/commands/update.ts TAP > updated config 1`] = `
{
  "projects": [
    {
      "scope": "proj",
      "directory": "subproj"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP > updated config 2`] = `
{
  "projects": [
    {
      "scope": "proj",
      "directory": "subproj"
    }
  ]
}
`

exports[`test/tap/commands/update.ts TAP > updated config 3`] = `
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

exports[`test/tap/commands/update.ts TAP > updated config 4`] = `
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
