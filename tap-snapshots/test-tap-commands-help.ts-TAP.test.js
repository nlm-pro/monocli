/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/help.ts TAP > help 1`] = `
Usage: monocli help [command name] 

Get help on monocli

If supplied a command name, then show the associated documentation.
    
If the command name is not provided, or does not exist, then show the main documentation.
`

exports[`test/tap/commands/help.ts TAP > main 1`] = `
Usage: monocli <command> [options]

Monorepo (Sub)Projects Manager

Commands: status, mv, help, update, check

Use monocli help <command name> for more information about one of these commands.

Options:
  --debug       <boolean>  enable debug mode (set log level to "silly")  (default: false)
`

exports[`test/tap/commands/help.ts TAP > mv 1`] = `
Usage: monocli mv <path> <new-path> 

change a subtree prefix
This command requires that <path> is associated with a existing project.

⚠️  Experimental command  ⚠️
`

exports[`test/tap/commands/help.ts TAP > status 1`] = `
Usage: monocli status  

show the monorepo status
include git status and details about the monorepo state and config
`

exports[`test/tap/commands/help.ts TAP > status 2`] = `
Usage: monocli update <directory> [url] 

update the remote "subtree" repo associated to <directory>
`

exports[`test/tap/commands/help.ts TAP > unknown command name 1`] = `
Usage: monocli <command> [options]

Monorepo (Sub)Projects Manager

Commands: status, mv, help, update, check

Use monocli help <command name> for more information about one of these commands.

Options:
  --debug       <boolean>  enable debug mode (set log level to "silly")  (default: false)
`
