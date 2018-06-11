@heroku-cli/addons-admin
========================

Heroku CLI plugin to help Heroku add-on providers integrate their services with Heroku.

[![Version](https://img.shields.io/npm/v/@heroku-cli/addons-admin.svg)](https://npmjs.org/package/@heroku-cli/addons-admin)
[![CircleCI](https://circleci.com/gh/heroku/heroku-cli-addons-admin/tree/master.svg?style=shield)](https://circleci.com/gh/heroku/heroku-cli-addons-admin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/heroku/heroku-cli-addons-admin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/heroku-cli-addons-admin/branch/master)
[![Codecov](https://codecov.io/gh/heroku/heroku-cli-addons-admin/branch/master/graph/badge.svg)](https://codecov.io/gh/heroku/heroku-cli-addons-admin)
[![Downloads/week](https://img.shields.io/npm/dw/@heroku-cli/addons-admin.svg)](https://npmjs.org/package/@heroku-cli/addons-admin)
[![License](https://img.shields.io/npm/l/@heroku-cli/addons-admin.svg)](https://github.com/heroku/heroku-cli-addons-admin/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @heroku-cli/addons-admin
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@heroku-cli/addons-admin/0.0.1 darwin-x64 node-v10.3.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example addons:admin:manifest:fetch [SLUG]`](#oclif-example-addonsadminmanifestfetch-slug)
* [`oclif-example addons:admin:manifest:generate`](#oclif-example-addonsadminmanifestgenerate)
* [`oclif-example addons:admin:manifest:pull [FILE]`](#oclif-example-addonsadminmanifestpull-file)
* [`oclif-example addons:admin:manifest:push [FILE]`](#oclif-example-addonsadminmanifestpush-file)

## `oclif-example addons:admin:manifest:fetch [SLUG]`

fetch a manifest for a given slug

```
USAGE
  $ oclif-example addons:admin:manifest:fetch [SLUG]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ heroku addons:admin:fetch slowdb
  {...
```

_See code: [src/commands/addons/admin/manifest/fetch.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/addons/admin/manifest/fetch.ts)_

## `oclif-example addons:admin:manifest:generate`

generate a manifest template

```
USAGE
  $ oclif-example addons:admin:manifest:generate

EXAMPLE
  $ oclif-example addons:admin:generate
  The file has been saved!
```

_See code: [src/commands/addons/admin/manifest/generate.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/addons/admin/manifest/generate.ts)_

## `oclif-example addons:admin:manifest:pull [FILE]`

describe the command here

```
USAGE
  $ oclif-example addons:admin:manifest:pull [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/addons/admin/manifest/pull.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/addons/admin/manifest/pull.ts)_

## `oclif-example addons:admin:manifest:push [FILE]`

push created manifest

```
USAGE
  $ oclif-example addons:admin:manifest:push [FILE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/addons/admin/manifest/push.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/addons/admin/manifest/push.ts)_
<!-- commandsstop -->
