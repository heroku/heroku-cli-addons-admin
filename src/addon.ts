import colorImport from '@heroku-cli/color'
import {HTTPError} from '@heroku/http-call'
import {Config, ux} from '@oclif/core'

const color = colorImport.default

import AddonClient from './addon-client.js'
import {ManifestInterface, ManifestLocal, ManifestRemote} from './manifest.js'

export default class Addon {
  readonly argsSlug?: string
  private readonly _client: AddonClient
  private readonly _local: ManifestLocal
  private readonly _remote: ManifestRemote

  constructor(config: Config, argsSlug?: string) {
    this.argsSlug = argsSlug
    this._local = new ManifestLocal()
    this._remote = new ManifestRemote(this)

    this._client = new AddonClient(config)
  }

  client(): AddonClient {
    return this._client
  }

  local(): ManifestLocal {
    return this._local
  }

  async manifest(uuid: string): Promise<ManifestInterface> {
    const slug = await this.slug()
    ux.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
    try {
      const body = await this._client.get(`/api/v3/addons/${encodeURIComponent(slug)}/manifests/${encodeURIComponent(uuid)}`)
      return body.contents
    } finally {
      ux.action.stop()
    }
  }

  async manifests(): Promise<ManifestInterface[]> {
    const slug = await this.slug()
    ux.action.start(`Fetching add-on manifests for ${color.addon(slug)}`)
    try {
      const body = await this._client.get(`/api/v3/addons/${encodeURIComponent(slug)}/manifests`).catch((error: HTTPError) => {
        const errorBody = error?.body?.error
        if (errorBody) {
          ux.error(errorBody)
        }

        throw error
      })
      return body
    } finally {
      ux.action.stop()
    }
  }

  remote(): ManifestRemote {
    return this._remote
  }

  async slug(): Promise<string> {
    // allows users to pull without declaring slug
    if (this.argsSlug) {
      return this.argsSlug
    }

    const manifest = await this.local().get()
    if (!manifest.id) {
      ux.error('No slug found in manifest')
    }

    return manifest.id
  }
}
