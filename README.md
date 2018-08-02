@heroku-cli/plugin-addons-admin
========================

Heroku CLI plugin to help Heroku add-on providers integrate their services with Heroku.

[![Version](https://img.shields.io/npm/v/@heroku-cli/plugin-addons-admin.svg)](https://www.npmjs.com/package/@heroku-cli/plugin-addons-admin)
[![CircleCI](https://circleci.com/gh/heroku/heroku-cli-addons-admin/tree/master.svg?style=svg&circle-token=db696925a68c516a4f432c64530c5df9ba305b16)](https://circleci.com/gh/heroku/heroku-cli-addons-admin/tree/master)
<!-- [![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/heroku/heroku-cli-addons-admin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/heroku-cli-addons-admin/branch/master) -->
<!-- [![Codecov](https://codecov.io/gh/heroku/heroku-cli-addons-admin/branch/master/graph/badge.svg)](https://codecov.io/gh/heroku/heroku-cli-addons-admin) -->
[![Downloads/week](https://img.shields.io/npm/dw/@heroku-cli/plugin-addons-admin.svg)](https://npmjs.org/package/@heroku-cli/plugin-addons-admin)
[![License](https://img.shields.io/npm/l/@heroku-cli/plugin-addons-admin.svg)](https://github.com/heroku/heroku-cli-addons-admin/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @heroku-cli/plugin-addons-admin
$ heroku COMMAND
running command...
$ heroku (-v|--version|version)
@heroku-cli/plugin-addons-admin/0.1.2 darwin-x64 node-v10.3.0
$ heroku --help [COMMAND]
USAGE
  $ heroku COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`heroku addons:admin:manifest:diff`](#heroku-addonsadminmanifestdiff)
* [`heroku addons:admin:manifest:generate`](#heroku-addonsadminmanifestgenerate)
* [`heroku addons:admin:manifest:pull [SLUG]`](#heroku-addonsadminmanifestpull-slug)
* [`heroku addons:admin:manifest:push`](#heroku-addonsadminmanifestpush)

## `heroku addons:admin:manifest:diff`

compares remote manifest to local manifest and finds differences

```
USAGE
  $ heroku addons:admin:manifest:diff
```

_See code: [src/commands/addons/admin/manifest/diff.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.2/src/commands/addons/admin/manifest/diff.ts)_

## `heroku addons:admin:manifest:generate`

generate a manifest template

```
USAGE
  $ heroku addons:admin:manifest:generate

OPTIONS
  -a, --addon=addon  [OPTIONAL] add-on name (name displayed on addon dashboard)
  -h, --help         show CLI help
  -s, --slug=slug    [OPTIONAL] slugname/manifest id

EXAMPLE
  $ heroku addons:admin:generate
  The file has been saved!
```

_See code: [src/commands/addons/admin/manifest/generate.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.2/src/commands/addons/admin/manifest/generate.ts)_

## `heroku addons:admin:manifest:pull [SLUG]`

pull a manifest for a given slug

```
USAGE
  $ heroku addons:admin:manifest:pull [SLUG]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ heroku addons:admin:manifest:pull testing-123
    ...
    Fetching add-on manifest for testing-123... done
    Updating addon_manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/pull.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.2/src/commands/addons/admin/manifest/pull.ts)_

## `heroku addons:admin:manifest:push`

update remote manifest

```
USAGE
  $ heroku addons:admin:manifest:push

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ heroku addons:admin:manifest:push
    ...
    Pushing manifest... done
    Updating addon_manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/push.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.1.2/src/commands/addons/admin/manifest/push.ts)_
<!-- commandsstop -->
