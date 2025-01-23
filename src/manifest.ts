import color from '@heroku-cli/color'
import {ux} from '@oclif/core'
import * as fs from 'fs-extra'

import Addon from './addon'

export interface ManifestInterface {
  $base?: string
  api: ManifestAPIInterface
  id: string
  name: string
}

interface ManifestAPIInterface {
  config_vars: string[]
  config_vars_prefix: string
  password: string
  production: {
    base_url: string
    sso_url: string
  }
  regions: string[]
  requires: string[]
  sso_salt: string
  version: string
}

export abstract class Manifest {
  manifest?: ManifestInterface
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

  abstract _get(): Promise<ManifestInterface>

  abstract _set(manifest: ManifestInterface): Promise<ManifestInterface>
}

export class ManifestLocal extends Manifest {
  _filename: string

  constructor() {
    super()
    if (fs.existsSync('addon_manifest.json')) {
      ux.warn('Using addon_manifest.json was a bug, please rename to addon-manifest.json')
      this._filename = 'addon_manifest.json'
    } else {
      this._filename = 'addon-manifest.json'
    }
  }

  filename(): string {
    return this._filename
  }

  async log(): Promise<void> {
    ux.log(color.bold(JSON.stringify(await this.get(), null, 2)))
  }

  async _get(): Promise<ManifestInterface> {
    let manifest
    try {
      manifest = fs.readFileSync(this.filename(), 'utf8')
    } catch (error) {
      throw new Error(`Check if ${this.filename()} exists in root. \n ${error}`)
    }

    if (!manifest) {
      throw new Error('No manifest found. Please generate a manifest first.')
    }

    return JSON.parse(manifest)
  }

  async _set(manifest: ManifestInterface): Promise<ManifestInterface> {
    ux.action.start(`Updating ${color.blue(this.filename())}`)
    fs.writeFileSync(this.filename(), JSON.stringify(manifest, null, 2))
    ux.action.stop()
    return manifest
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
    ux.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
    const body = await this.addon.client().get(`/api/v3/addons/${encodeURIComponent(slug)}/current_manifest`)
    ux.action.stop()

    return body.contents
  }

  async _set(manifest: ManifestInterface): Promise<ManifestInterface> {
    const requestBody = {contents: manifest}
    ux.action.start('Pushing manifest')
    const body = await this.addon.client().post(`/api/v3/addons/${encodeURIComponent(manifest.id)}/manifests`, requestBody)
    ux.action.stop()

    return body.contents
  }
}

export default Manifest
