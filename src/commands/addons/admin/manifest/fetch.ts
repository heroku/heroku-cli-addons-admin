// CommandExtension
import CommandExtension from '../../../../CommandExtension'
// heroku-cli
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import color from '@heroku-cli/color'

// other packages
import cli from 'cli-ux'

export default class Fetch extends CommandExtension {
  static description = 'fetch a manifest for a given slug'

  static examples = [ `$ heroku addons:admin:fetch slowdb
{...`, ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'slug'}]

  async run() {
    const {args, flags} = this.parse(Fetch)

    let {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false})
    let email = account.email

    let defaultOptions = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      }
    }
    const slug = args.slug
    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)

    const {body} = await this.heroku.get<any>(`${host}/provider/addons/${slug}`, defaultOptions)
    // this.log(body)
    console.log(color.bold(JSON.stringify(body, null, 1)))
  }
}
