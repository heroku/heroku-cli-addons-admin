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
* [Command Topics](#command-topics)
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
$ heroku (--version)
@heroku-cli/plugin-addons-admin/4.0.2 linux-x64 node-v22.23.2
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
# Command Topics

* [`heroku addons`](docs/addons.md) - compares remote manifest to local manifest and finds differences

<!-- commandsstop -->
