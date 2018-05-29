@heroku-cli/addons-admin
========================

Heroku CLI plugin to help Heroku add-on providers integrate their services.

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
$ addons-admin COMMAND
running command...
$ addons-admin (-v|--version|version)
@heroku-cli/addons-admin/0.0.1 darwin-x64 node-v10.3.0
$ addons-admin --help [COMMAND]
USAGE
  $ addons-admin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`addons-admin hello [FILE]`](#addons-admin-hello-file)
* [`addons-admin help [COMMAND]`](#addons-admin-help-command)

## `addons-admin hello [FILE]`

describe the command here

```
USAGE
  $ addons-admin hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ addons-admin hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/v0.0.1/src/commands/hello.ts)_

## `addons-admin help [COMMAND]`

display help for addons-admin

```
USAGE
  $ addons-admin help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.11/src/commands/help.ts)_
<!-- commandsstop -->
