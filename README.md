# Monocli

One CLI to rule them all.

## Quick Start

```shell-session
$ npm install --global monocli

$ monocli help
```

## Principles

`monocli` is a very simple "Meta" CLI, helping you to better use other ones in advanced ways.

Its first goal is to ease monorepos management, without requiring any other tool.

It aim to be as **generic**, **light**, **efficient** and **simple** as possible.

1. **No need to reinvent the wheel**: `monocli` simply run other commands with some tricks and hacks, that it!
2. **Keep your freedom**: you will always be able to use other CLI tools alongside `monocli`, or even to drop `monocli` entirely anytime you want
3. **Learn from the bests**: `monocli` helps you learn and follow good practices and conventions

## Commands

```shell-session
$ monocli <command> <params> <options>
```

Run `monocli help` and `monocli help <command>` for more information.

### Git

- `help`: display usage info
- `add`: add, convert or import a project
- `check`: check if a directory has changed since a release
- `mv`: change a subtree prefix
- `update`: update a remote subtree
- `status`: show the monorepo status
