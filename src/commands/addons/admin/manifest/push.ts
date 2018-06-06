// heroku-cli
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import color from '@heroku-cli/color'

// other packages
import cli from 'cli-ux'


export default class Push extends Command {
  static description = 'push created manifest'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Push)

    let {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false})
    let email = account.email

    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

    let defaultOptions = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      },
      body: {
        "contents": "test"
      }
    }

    cli.action.start(`Pushing manifest`)

    const {body} = await this.heroku.post<any>(`${host}/provider/addons`, defaultOptions)
    console.log(body)
  }
}
