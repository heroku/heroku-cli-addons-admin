import {APIClient, Command} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import * as fs from 'fs-extra'

export default abstract class AdminBase extends Command {
  get addons() {
    const client = new APIClient(this.config)
    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

    let options = {
      host,
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

  async email(): Promise<string | undefined> {
    let {body} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false})
    return body.email
  }

  readManifest(): string | undefined {
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

  generateManifest(data: any = {}) {
    let manifest: ManifestInterface = {
      id: 'myaddon',
      api: {
        config_vars_prefix: 'MYADDON',
        config_vars: [
          'MYADDON_URL'
        ],
        password: 'CHANGEME',
        sso_salt: 'CHANGEME',
        regions: ['us', 'eu'],
        requires: [],
        production: {
          base_url: 'https://myaddon.com/heroku/resources',
          sso_url: 'https://myaddon.com/sso/login'
        },
        test: {
          // tslint:disable-next-line:no-http-string
          base_url: 'http://localhost:4567/heroku/resources',
          // tslint:disable-next-line:no-http-string
          sso_url: 'http://localhost:4567/sso/login'
        },
        version: '3'
      },
      name: 'MyAddon',
    }

    manifest.id = data.id || manifest.id
    manifest.api.config_vars_prefix = (data.id ? data.id.toUpperCase() : manifest.api.config_vars_prefix)
    manifest.api.config_vars = (data.id ? [`${data.id.toUpperCase()}_URL`] : manifest.api.config_vars)
    manifest.api.password = data.password || manifest.api.password
    manifest.api.sso_salt = data.sso_salt || manifest.api.sso_salt
    manifest.api.regions = data.regions || manifest.api.regions
    manifest.name = data.name || manifest.name
    return manifest
  }

}

export interface ManifestInterface {
  id: string
  name: string
  api: ManifestAPIInterface
  $base?: string
}

export interface ManifestAPIInterface {
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
