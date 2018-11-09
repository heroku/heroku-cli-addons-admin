import color from '@heroku-cli/color'
import {APIClient, Command} from '@heroku-cli/command'
import cli from 'cli-ux'
import * as url from 'url'
import * as _ from 'lodash'

export default abstract class AdminBase extends Command {
  get addons() {
    const client = new APIClient(this.config, {})
    const host = process.env.HEROKU_ADDONS_HOST
    client.defaults.host = host ? url.parse(host).host : 'addons.heroku.com'

    let options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'kensa future'
      }
    }

    const pull = async (slug: string) => {
      try {
        cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
        const response = await client.get(`/api/v3/addons/${encodeURIComponent(slug)}/current_manifest`, options)
        const body: any = response.body
        cli.action.stop()

        return body.contents
      } catch(err) {
        const error = _.get(err, 'body.error')
        if (error) {
          this.error(error)
        }
        throw err
      }
    }

    const push = async (manifest: any) => {
      const requestBody = {contents: manifest}
      let opts = {
        ...options,
        body: requestBody
      }

      try {
        cli.action.start('Pushing manifest')
        const response = await client.post(`/api/v3/addons/${encodeURIComponent(manifest.id)}/manifests`, opts)
        const body: any = response.body
        cli.action.stop()

        return body.contents
      } catch(err) {
        const baseErrors = _.get(err, 'body.error.base')
        if (baseErrors) {
          this.error(baseErrors.join(", "))
        }
        const error = _.get(err, 'body.error')
        if (error) {
          this.error(error)
        }
        throw err
      }
    }

    return {
      pull,
      push
    }
  }
}
