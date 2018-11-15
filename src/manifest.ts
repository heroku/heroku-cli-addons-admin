import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

export interface ManifestInterface {
  id: string
  name: string
  api: ManifestAPIInterface
  $base?: string
}

interface ManifestAPIInterface {
  config_vars_prefix: string
  config_vars: string[]
  password: string
  sso_salt: string
  regions: string[]
  requires: string[]
  production: {
    base_url: string
    sso_url: string
  }
  test: {
    base_url: string
    sso_url: string
  }
  version: string
}

export const ReadManifest = {
  run(): string {
    let manifest
    try {
      manifest = fs.readFileSync('addon_manifest.json', 'utf8')
    } catch (err) {
      throw new Error(`Check if addon_manifest.json exists in root. \n ${err}`)
    }
    if (!manifest) {
      throw new Error('No manifest found. Please generate a manifest first.')
    }
    return manifest
  },

  json(): ManifestInterface {
    const json = JSON.parse(this.run())
    if (!json.id) {
      cli.error('No slug found in manifest')
    }
    return JSON.parse(this.run())
  },

  slug(slugArg: string): string {
    // allows users to pull without declaring slug
    if (slugArg) {
      return slugArg
    }
    return ReadManifest.json().id
  }
}

export const WriteManifest = {
  run(newManifest: ManifestInterface): void {
    cli.action.start(`Updating ${color.blue('addon_manifest.json')}`)
    fs.writeFileSync('addon_manifest.json', JSON.stringify(newManifest, null, 2))
    cli.action.stop()
  }
}

export const LogManifest = {
  run(manifest: ManifestInterface): void {
    cli.log(color.bold(JSON.stringify(manifest, null, 1)))
  }
}
