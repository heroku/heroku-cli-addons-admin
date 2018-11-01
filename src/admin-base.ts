import {APIClient, Command} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import * as fs from 'fs-extra'
import * as url from 'url'

export default abstract class AdminBase extends Command {
  _email: string | undefined

  get readLocalManifest(): string | undefined {
    let manifest
    try {
      manifest = fs.readFileSync('addon_manifest.json', 'utf8')
    } catch (err) {
      this.error(`Check if addon_manifest.json exists in root. \n ${err}`)
    }
    if (!manifest) {
      this.error('No manifest found. Please generate a manifest first.')
    }
    return manifest
  }

  get addons() {
    const client = new APIClient(this.config, {})
    const host = process.env.HEROKU_ADDONS_HOST
    client.defaults.host = host ? url.parse(host).host : 'addons.heroku.com'

    let options = {
      headers: {
        Authorization: '',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'kensa future'
      }
    }

    const get = async (path: string) => {
      const email = await this.email()
      const auth = `Basic ${Buffer.from(`${email}:${this.heroku.auth}`).toString('base64')}`
      options.headers.Authorization = auth
      return client.get(path, options)
    }

    const post = async (path: string, body: any) => {
      const email = await this.email()
      const auth = `Basic ${Buffer.from(`${email}:${this.heroku.auth}`).toString('base64')}`
      options.headers.Authorization = auth
      let opts = {
        ...options,
        body
      }
      return client.post(path, opts)
    }

    return {
      get,
      post
    }
  }

  private async email(): Promise<string | undefined> {
    if (this._email) return this._email
    let {body} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false})
    this._email = body.email
    return body.email
  }
}
