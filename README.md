@heroku-cli/plugin-addons-admin
========================

Heroku CLI plugin to help Heroku add-on providers integrate their services with Heroku.

[![Version](https://img.shields.io/npm/v/@heroku-cli/addons-admin.svg)](https://npmjs.org/package/@heroku-cli/addons-admin)
[![CircleCI](https://circleci.com/gh/heroku/heroku-cli-addons-admin/tree/master.svg?style=svg)](https://circleci.com/gh/heroku/heroku-cli-addons-admin/tree/master)
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
$ npm install -g @heroku-cli/plugin-addons-admin
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@heroku-cli/plugin-addons-admin/0.1.1 darwin-x64 node-v10.3.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example addons:admin:manifest:diff`](#oclif-example-addonsadminmanifestdiff)
* [`oclif-example addons:admin:manifest:generate`](#oclif-example-addonsadminmanifestgenerate)
* [`oclif-example addons:admin:manifest:pull [SLUG]`](#oclif-example-addonsadminmanifestpull-slug)
* [`oclif-example addons:admin:manifest:push`](#oclif-example-addonsadminmanifestpush)

## `oclif-example addons:admin:manifest:diff`

compares remote manifest to local manifest and finds differences

```
USAGE
  $ oclif-example addons:admin:manifest:diff
```

_See code: [src/commands/addons/admin/manifest/diff.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.1/src/commands/addons/admin/manifest/diff.ts)_

## `oclif-example addons:admin:manifest:generate`

generate a manifest template

```
USAGE
  $ oclif-example addons:admin:manifest:generate

OPTIONS
  -a, --addon=addon  [OPTIONAL] addon name (name displayed to on addon dashboard)
  -h, --help         show CLI help
  -s, --slug=slug    [OPTIONAL] slugname/manifest id

EXAMPLE
  $ oclif-example addons:admin:generate
  The file has been saved!
```

_See code: [src/commands/addons/admin/manifest/generate.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.1/src/commands/addons/admin/manifest/generate.ts)_

## `oclif-example addons:admin:manifest:pull [SLUG]`

pull a manifest for a given slug

```
USAGE
  $ oclif-example addons:admin:manifest:pull [SLUG]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ heroku addons:admin:manifest:pull testing-123
    ...
    Fetching add-on manifest for testing-123... done
    Updating addon_manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/pull.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.1/src/commands/addons/admin/manifest/pull.ts)_

## `oclif-example addons:admin:manifest:push`

push created manifest

```
USAGE
  $ oclif-example addons:admin:manifest:push

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ heroku addons:admin:manifest:push
    ...
    Pushing manifest... done
    Updating addon_manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/push.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.1/src/commands/addons/admin/manifest/push.ts)_
<!-- commandsstop -->
