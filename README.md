# Heroku CLI Addons Admin Plugin

Heroku CLI plugin to help Heroku add-on providers integrate their services with Heroku.

[![Version](https://img.shields.io/npm/v/@heroku-cli/plugin-addons-admin.svg)](https://www.npmjs.com/package/@heroku-cli/plugin-addons-admin)
[![Downloads/week](https://img.shields.io/npm/dw/@heroku-cli/plugin-addons-admin.svg)](https://npmjs.org/package/@heroku-cli/plugin-addons-admin)
[![License](https://img.shields.io/npm/l/@heroku-cli/plugin-addons-admin.svg)](https://github.com/heroku/heroku-cli-addons-admin/blob/master/package.json)

<!-- toc -->
* [Heroku CLI Addons Admin Plugin](#heroku-cli-addons-admin-plugin)
* [Installation](#installation)
* [Usage](#usage)
* [Development](#development)
* [Commands](#commands)
<!-- tocstop -->

# Installation
```sh-session
$ heroku plugins:install @heroku-cli/plugin-addons-admin
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g @heroku-cli/plugin-addons-admin
$ heroku COMMAND
running command...
$ heroku (-v|--version|version)
@heroku-cli/plugin-addons-admin/2.4.0 darwin-x64 node-v16.20.2
$ heroku --help [COMMAND]
USAGE
  $ heroku COMMAND
...
```
<!-- usagestop -->

# Development

Follow the [Developing CLI Plugins](https://devcenter.heroku.com/articles/developing-cli-plugins) guide.

# Commands
<!-- commands -->
* [`heroku addons:admin:manifest:diff`](#heroku-addonsadminmanifestdiff)
* [`heroku addons:admin:manifest:generate`](#heroku-addonsadminmanifestgenerate)
* [`heroku addons:admin:manifest:pull [SLUG]`](#heroku-addonsadminmanifestpull-slug)
* [`heroku addons:admin:manifest:push`](#heroku-addonsadminmanifestpush)
* [`heroku addons:admin:manifests [SLUG]`](#heroku-addonsadminmanifests-slug)
* [`heroku addons:admin:manifests:info [SLUG]`](#heroku-addonsadminmanifestsinfo-slug)
* [`heroku addons:admin:open [SLUG]`](#heroku-addonsadminopen-slug)

## `heroku addons:admin:manifest:diff`

compares remote manifest to local manifest and finds differences

```
USAGE
  $ heroku addons:admin:manifest:diff
```

_See code: [src/commands/addons/admin/manifest/diff.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/manifest/diff.ts)_

## `heroku addons:admin:manifest:generate`

generate a manifest template

```
USAGE
  $ heroku addons:admin:manifest:generate

OPTIONS
  -a, --addon=addon  add-on name (name displayed on addon dashboard)
  -s, --slug=slug    slugname/manifest id

EXAMPLE
  $ heroku addons:admin:generate
  The file has been saved!
```

_See code: [src/commands/addons/admin/manifest/generate.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/manifest/generate.ts)_

## `heroku addons:admin:manifest:pull [SLUG]`

pull a manifest for a given slug

```
USAGE
  $ heroku addons:admin:manifest:pull [SLUG]

ARGUMENTS
  SLUG  slug name of add-on

EXAMPLE
  $ heroku addons:admin:manifest:pull testing-123
   ...
   Fetching add-on manifest for testing-123... done
   Updating addon-manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/pull.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/manifest/pull.ts)_

## `heroku addons:admin:manifest:push`

update remote manifest

```
USAGE
  $ heroku addons:admin:manifest:push

EXAMPLE
  $ heroku addons:admin:manifest:push
   ...
   Pushing manifest... done
   Updating addon-manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/push.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/manifest/push.ts)_

## `heroku addons:admin:manifests [SLUG]`

list manifest history

```
USAGE
  $ heroku addons:admin:manifests [SLUG]
```

_See code: [src/commands/addons/admin/manifests.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/manifests.ts)_

## `heroku addons:admin:manifests:info [SLUG]`

show an individual history manifest

```
USAGE
  $ heroku addons:admin:manifests:info [SLUG]

OPTIONS
  -m, --manifest=manifest  (required) manifest history id
```

_See code: [src/commands/addons/admin/manifests/info.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/manifests/info.ts)_

## `heroku addons:admin:open [SLUG]`

open add-on dashboard

```
USAGE
  $ heroku addons:admin:open [SLUG]

ARGUMENTS
  SLUG  slug name of add-on

EXAMPLE
  $ heroku addons:admin:open
  Checking addon-manifest.json... done
  Opening https://addons-next.heroku.com/addons/testing-123... done
```

_See code: [src/commands/addons/admin/open.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v2.4.0/src/commands/addons/admin/open.ts)_
<!-- commandsstop -->
