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
* [`oclif-example addons:admin:create_manifest`](#oclif-example-addonsadmincreate-manifest)
* [`oclif-example hello [FILE]`](#oclif-example-hello-file)

## `oclif-example addons:admin:create_manifest`

generate a manifest template

```
USAGE
  $ oclif-example addons:admin:create_manifest
```

_See code: [src/commands/addons/admin/create_manifest.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/addons/admin/create_manifest.ts)_

## `oclif-example hello [FILE]`

describe the command here

```
USAGE
  $ oclif-example hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ oclif-example hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/hello.ts)_
<!-- commandsstop -->
