import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

import Addon from './addon'

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
  version: string
}

export abstract class Manifest {
  manifest?: ManifestInterface
  abstract async _get(): Promise<ManifestInterface>
  abstract async _set(manifest: ManifestInterface): Promise<ManifestInterface>

  async get(): Promise<ManifestInterface> {
    if (this.manifest) {
      return this.manifest!
    }

    this.manifest = await this._get()
    return this.manifest!
  }

  async set(manifest: ManifestInterface): Promise<ManifestInterface> {
    this.manifest = await this._set(manifest)
    return this.manifest
  }
}

export class ManifestLocal extends Manifest {
  _filename: string

  constructor() {
    super()
    if (fs.existsSync('addon_manifest.json')) {
      cli.warn('Using addon_manifest.json was a bug, please rename to addon-manifest.json')
      this._filename = 'addon_manifest.json'
    } else {
      this._filename = 'addon-manifest.json'
    }
  }

  async _get(): Promise<ManifestInterface> {
    let manifest
    try {
      manifest = fs.readFileSync(this.filename(), 'utf8')
    } catch (err) {
      throw new Error(`Check if ${this.filename()} exists in root. \n ${err}`)
    }

    if (!manifest) {
      throw new Error('No manifest found. Please generate a manifest first.')
    }

    return JSON.parse(manifest)
  }

  async _set(manifest: ManifestInterface): Promise<ManifestInterface> {
    cli.action.start(`Updating ${color.blue(this.filename())}`)
    fs.writeFileSync(this.filename(), JSON.stringify(manifest, null, 2))
    cli.action.stop()
    return manifest
  }

  async log(): Promise<void> {
    cli.log(color.bold(JSON.stringify(await this.get(), null, 2)))
  }

  filename(): string {
    return this._filename
  }
}

export class ManifestRemote extends Manifest {
  addon: Addon

  constructor(addon: Addon) {
    super()
    this.addon = addon
  }

  async _get(): Promise<ManifestInterface> {
    const slug = await this.addon.slug()
    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
    const body = await this.addon.client().get(`/api/v3/addons/${encodeURIComponent(slug)}/current_manifest`)
    cli.action.stop()

    return body.contents
  }

  async _set(manifest: ManifestInterface): Promise<ManifestInterface> {
    const requestBody = {contents: manifest}
    cli.action.start('Pushing manifest')
    const body = await this.addon.client().post(`/api/v3/addons/${encodeURIComponent(manifest.id)}/manifests`, requestBody)
    cli.action.stop()

    return body.contents
  }
}

export default Manifest
