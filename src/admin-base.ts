import color from '@heroku-cli/color'
import {Command} from '@heroku-cli/command'
import cli from 'cli-ux'

import AddonClient from './addon-client'

export default abstract class AdminBase extends Command {
  get addons() {
    const client = new AddonClient(this.config)

    const pull = async (slug: string) => {
      cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
      const body = await client.get(`/api/v3/addons/${encodeURIComponent(slug)}/current_manifest`)
      cli.action.stop()

      return body.contents
    }

    const manifests = async (slug: string) => {
      cli.action.start(`Fetching add-on manifests for ${color.addon(slug)}`)
      const body = await client.get(`/api/v3/addons/${encodeURIComponent(slug)}/manifests`)
      cli.action.stop()

      return body
    }

    const manifest = async (slug: string, uuid: string) => {
      cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
      const body = await client.get(`/api/v3/addons/${encodeURIComponent(slug)}/manifests/${encodeURIComponent(uuid)}`)
      cli.action.stop()

      return body.contents
    }

    const push = async (manifest: any) => {
      const requestBody = {contents: manifest}
      cli.action.start('Pushing manifest')
      const body = await client.post(`/api/v3/addons/${encodeURIComponent(manifest.id)}/manifests`, requestBody)
      cli.action.stop()

      return body.contents
    }

    return {
      manifests,
      manifest,
      pull,
      push
    }
  }
}
