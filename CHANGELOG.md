# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/noelmace/monocli/compare/v0.5.0-beta.3...v0.5.0) (2020-05-23)


### Bug Fixes

* **spull,spush,update:** success log ([862de48](https://github.com/noelmace/monocli/commit/862de484ed80687d4782357c494136816646fa69))

## [0.5.0-beta.3](https://github.com/noelmace/monocli/compare/v0.5.0-beta.2...v0.5.0-beta.3) (2020-05-22)


### ⚠ BREAKING CHANGES

* **spush,spull,update:** spush, spull and update commands now uses
options instead of arguments in order to define the remote url and
branch

**before**
```
monocli spush my-project/ git@github.com:me/my-project.git my-branch
monocli spull my-project/ git@github.com:me/my-project.git my-branch
monocli update my-project/ git@github.com:me/my-project.git my-branch
```

**after**
```
monocli spush my-project/ --url git@github.com:me/my-project.git --branch my-branch
monocli spull my-project/ --url git@github.com:me/my-project.git --branch my-branch
monocli update my-project/ --url git@github.com:me/my-project.git --branch my-branch
```

### Features

* **spush,spull,update:** every defined projects ([27fa53e](https://github.com/noelmace/monocli/commit/27fa53ec104408da34c757266a74b7820aebc9b4))


* **spush,spull,update:** only keep directory arg ([c7096c1](https://github.com/noelmace/monocli/commit/c7096c1e7454c11aa3b3b8568ae8d5efc668ec12))

## [0.5.0-beta.2](https://github.com/noelmace/monocli/compare/v0.5.0-beta.1...v0.5.0-beta.2) (2020-05-17)


### Features

* new rm command ([8aa8a47](https://github.com/noelmace/monocli/commit/8aa8a47d5d56d641a42949d2b40cf11053202a6e))

## [0.5.0-beta.1](https://github.com/noelmace/monocli/compare/v0.4.4...v0.5.0-beta.1) (2020-04-27)


### ⚠ BREAKING CHANGES

* **add:** the `add` command is now interactive.
You need to use the `--trust` option in order to force push by default
as before, or you'll get a confirm prompt if there is any conflict.
* when using the `add` command, you should now use
a `--trust` option instead of `--yes`

before: `monocli add myproj --rewrite --yes`

after: `monocli add myproj --rewrite --trust`

### Features

* **add:** new branch option ([c352e81](https://github.com/noelmace/monocli/commit/c352e813f341776f3822a1185f86eb0e9762519d))
* **spush:** save branch before force push ([b78cd75](https://github.com/noelmace/monocli/commit/b78cd759233eef3fa76bbf17814e76f0ee26ed66))
* **update:** pull if push failed ([c2ae3cf](https://github.com/noelmace/monocli/commit/c2ae3cf786e06caa309efdeb04aa13d4dc91195e))
* new spush and spull commands ([6e6a0cf](https://github.com/noelmace/monocli/commit/6e6a0cf15a501a21da52e65abcdfdc89f0be6508))


### Bug Fixes

* **add:** do not force push by default ([4467db9](https://github.com/noelmace/monocli/commit/4467db94b15085d097b5a3db6cf81e7112014056))
* **spush:** options consistency with spull ([2843b37](https://github.com/noelmace/monocli/commit/2843b37a7174f9cff49e828ad5d66030a7611309))


* global --trust option ([4b840c3](https://github.com/noelmace/monocli/commit/4b840c3cf2be8a9763000596e4f29903c3d7f5fd))

### [0.4.4](https://github.com/noelmace/monocli/compare/v0.4.3...v0.4.4) (2020-04-26)


### Bug Fixes

* **add:** uncommited files ([5c924f9](https://github.com/noelmace/monocli/commit/5c924f950d8586637ad07d48c6fa697bf369f0d7))

### [0.4.3](https://github.com/noelmace/monocli/compare/v0.4.2...v0.4.3) (2020-04-24)


### Bug Fixes

* **add:** include scopes with # or / when rewriting ([13d4be0](https://github.com/noelmace/monocli/commit/13d4be08d3e67234bdda909e84ba716a28e3dedd)), closes [#1](https://github.com/noelmace/monocli/issues/1) [#1](https://github.com/noelmace/monocli/issues/1)

### [0.4.2](https://github.com/noelmace/monocli/compare/v0.4.1...v0.4.2) (2020-04-24)

### [0.4.1](https://github.com/noelmace/monocli/compare/v0.4.0...v0.4.1) (2020-04-23)


### Bug Fixes

* **add:** prompt ([e90eea2](https://github.com/noelmace/monocli/commit/e90eea2cb18a366ea88139f63433dfbbfa0b6aaa))

## [0.4.0](https://github.com/noelmace/monocli/compare/v0.1.0...v0.4.0) (2020-04-23)


### Features

* new add command ([930a06d](https://github.com/noelmace/monocli/commit/930a06d9f4f879bb70974a8f717330195bf9bd44))
* new check command ([1c26dd3](https://github.com/noelmace/monocli/commit/1c26dd30bcbd66353d4891212d7b493fd423957d))
* new help command ([7541fee](https://github.com/noelmace/monocli/commit/7541fee029112facfdb283fd2a99f04e4fc3278d))
* new mv command ([2f2e1aa](https://github.com/noelmace/monocli/commit/2f2e1aabfcaed46334885a6d990d516e4898ddc0))
* new status command ([c24565b](https://github.com/noelmace/monocli/commit/c24565b0090c6845b481d70046524a5ae5fe2b2c))
* new update command ([0d53cac](https://github.com/noelmace/monocli/commit/0d53cacdf47858f7e72870bf6f3b22f2b6788f0a))
* programmatic API ([3bcf589](https://github.com/noelmace/monocli/commit/3bcf5894293663ce360b30b8c4f99df18d1bce79))


### Bug Fixes

* allow reseting debug mode ([98bdf99](https://github.com/noelmace/monocli/commit/98bdf99c9763bf66165be10ab48f17eb91038411))
* **mv:** destination directory and config ([4b81d62](https://github.com/noelmace/monocli/commit/4b81d62a2d3fa94078a67745d0360e5b30261db7))
* **update:** allow relative url ([3b2cf49](https://github.com/noelmace/monocli/commit/3b2cf4956481e5e4da5b474e6646197d1a62418b))
