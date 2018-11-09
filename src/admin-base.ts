import color from '@heroku-cli/color'
import {APIClient, Command} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import cli from 'cli-ux'
import * as url from 'url'

export default abstract class AdminBase extends Command {
  _email: string | undefined

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

    const pull = async (slug: string) => {
      const email = await this.email()
      const auth = `Basic ${Buffer.from(`${email}:${this.heroku.auth}`).toString('base64')}`
      options.headers.Authorization = auth

      // GET request
      cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
      let {body} = await client.get(`/provider/addons/${slug}`, options)
      // if (err) {
      //   if (slug) {
      //     this.error(`Unable to make get data on a slug with the name of ${color.blue(slug)}`)
      //   } else {
      //     this.error('Please make sure you have a slug.')
      //   }
      // }
      cli.action.stop()
      return body
    }

    const push = async (manifest: any) => {
      const email = await this.email()
      const auth = `Basic ${Buffer.from(`${email}:${this.heroku.auth}`).toString('base64')}`
      options.headers.Authorization = auth
      let opts = {
        ...options,
        body: manifest
      }

      // POST request
      cli.action.start('Pushing manifest')
      let {body} = await client.post('/provider/addons', opts)
      // if (err) {
      //   const message: string = err.response.data
      //   if (message.includes('base')) {
      //     this.error(`${color.red(`Looks like an issue in your manifest. Please make sure there are no issues with your ${color.addon('$base')} or ${color.addon('id')} elements. Also try pulling with slugname as such:`)} \n${color.addon('heroku addons:admin:manifest:pull [SLUG]')}`)

      //   } else {
      //     this.error(`Following error from addons.heroku.com: ${color.red(message)}`)
      //   }
      //   // this.error(err)
      // }
      cli.action.stop()
      return body
    }

    return {
      pull,
      push
    }
  }

  private async email(): Promise<string | undefined> {
    if (this._email) return this._email
    let {body} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false})
    this._email = body.email
    return body.email
  }
}
