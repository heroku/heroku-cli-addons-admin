import {ux} from '@oclif/core'

import color from '@heroku-cli/color'
import {Config} from '@oclif/core'
import {HTTPError} from '@heroku/http-call'

import AddonClient from './addon-client'
import {ManifestInterface, ManifestLocal, ManifestRemote} from './manifest'

export default class Addon {
  readonly argsSlug?: string
  private readonly _local: ManifestLocal
  private readonly _remote: ManifestRemote
  private readonly _client: AddonClient

  constructor(config: Config, argsSlug?: string) {
    this.argsSlug = argsSlug
    this._local = new ManifestLocal()
    this._remote = new ManifestRemote(this)

    this._client = new AddonClient(config)
  }

  local(): ManifestLocal {
    return this._local
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

  async manifests(): Promise<ManifestInterface[]> {
    const slug = await this.slug()
    ux.action.start(`Fetching add-on manifests for ${color.addon(slug)}`)
    const body = await this._client.get(`/api/v3/addons/${encodeURIComponent(slug)}/manifests`).catch((error: HTTPError) => {
      const errorBody = error?.body?.error
      if (errorBody) {
        ux.error(errorBody)
      }

      throw error
    })

    ux.action.stop()
    return body
  }

  async manifest(uuid: string): Promise<ManifestInterface> {
    const slug = await this.slug()
    ux.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
    const body = await this._client.get(`/api/v3/addons/${encodeURIComponent(slug)}/manifests/${encodeURIComponent(uuid)}`)
    ux.action.stop()

    return body.contents
  }

  client(): AddonClient {
    return this._client
  }
}
