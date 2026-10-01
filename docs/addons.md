`heroku addons`
===============

compares remote manifest to local manifest and finds differences

* [`heroku addons:admin:manifest:diff`](#heroku-addonsadminmanifestdiff)
* [`heroku addons:admin:manifest:generate`](#heroku-addonsadminmanifestgenerate)
* [`heroku addons:admin:manifest:pull SLUG`](#heroku-addonsadminmanifestpull-slug)
* [`heroku addons:admin:manifest:push`](#heroku-addonsadminmanifestpush)
* [`heroku addons:admin:manifests [SLUG]`](#heroku-addonsadminmanifests-slug)
* [`heroku addons:admin:manifests:info [SLUG]`](#heroku-addonsadminmanifestsinfo-slug)
* [`heroku addons:admin:open [SLUG]`](#heroku-addonsadminopen-slug)

## `heroku addons:admin:manifest:diff`

compares remote manifest to local manifest and finds differences

```
USAGE
  $ heroku addons:admin:manifest:diff [--prompt]

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  compares remote manifest to local manifest and finds differences
```

_See code: [src/commands/addons/admin/manifest/diff.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/manifest/diff.ts)_

## `heroku addons:admin:manifest:generate`

generate a manifest template

```
USAGE
  $ heroku addons:admin:manifest:generate [--prompt] [-a <value>] [-s <value>]

FLAGS
  -a, --addon=<value>  add-on name (name displayed on addon dashboard)
  -s, --slug=<value>   slugname/manifest id

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  generate a manifest template

EXAMPLES
  $ heroku addons:admin:generate
  The file has been saved!
```

_See code: [src/commands/addons/admin/manifest/generate.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/manifest/generate.ts)_

## `heroku addons:admin:manifest:pull SLUG`

pull a manifest for a given slug

```
USAGE
  $ heroku addons:admin:manifest:pull SLUG [--prompt]

ARGUMENTS
  SLUG  slug name of add-on

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  pull a manifest for a given slug

EXAMPLES
  $ heroku addons:admin:manifest:pull testing-123
   ...
   Fetching add-on manifest for testing-123... done
   Updating addon-manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/pull.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/manifest/pull.ts)_

## `heroku addons:admin:manifest:push`

update remote manifest

```
USAGE
  $ heroku addons:admin:manifest:push [--prompt]

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  update remote manifest

EXAMPLES
  $ heroku addons:admin:manifest:push
   ...
   Pushing manifest... done
   Updating addon-manifest.json... done
```

_See code: [src/commands/addons/admin/manifest/push.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/manifest/push.ts)_

## `heroku addons:admin:manifests [SLUG]`

list manifest history

```
USAGE
  $ heroku addons:admin:manifests [SLUG] [--prompt]

ARGUMENTS
  [SLUG]  slug name of add-on

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  list manifest history
```

_See code: [src/commands/addons/admin/manifests.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/manifests.ts)_

## `heroku addons:admin:manifests:info [SLUG]`

show an individual history manifest

```
USAGE
  $ heroku addons:admin:manifests:info [SLUG] -m <value> [--prompt]

ARGUMENTS
  [SLUG]  slug name of add-on

FLAGS
  -m, --manifest=<value>  (required) manifest history id

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  show an individual history manifest
```

_See code: [src/commands/addons/admin/manifests/info.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/manifests/info.ts)_

## `heroku addons:admin:open [SLUG]`

open add-on dashboard

```
USAGE
  $ heroku addons:admin:open [SLUG] [--prompt]

ARGUMENTS
  [SLUG]  slug name of add-on

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  open add-on dashboard

EXAMPLES
  $ heroku addons:admin:open
      Checking addon-manifest.json... done
      Opening https://addons-next.heroku.com/addons/testing-123... done
```

_See code: [src/commands/addons/admin/open.ts](https://github.com/heroku/heroku-cli-addons-admin/blob/plugin-addons-admin-v4.0.2/src/commands/addons/admin/open.ts)_
