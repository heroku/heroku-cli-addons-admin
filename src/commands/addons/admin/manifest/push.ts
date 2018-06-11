// CommandExtension
import CommandExtension from '../../../../CommandExtension'

// heroku-cli
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import color from '@heroku-cli/color'

// other packages
import cli from 'cli-ux'
import * as fs from 'fs';

export default class Push extends CommandExtension {
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

    const manifest = fs.readFileSync('addon_manifest.json', 'utf8')
    if (!manifest) {
      this.error('No manifest found. Please generate a manifest before pushing.')
    }

    let defaultOptions = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      },
      body: manifest
    }

    cli.action.start(`Pushing manifest`)

    const {body} = await this.heroku.post<any>(`${host}/provider/addons`, defaultOptions)
    console.log(body)

    fs.writeFileSync('addon_manifest.json', JSON.stringify(body, null, 2), (err) => {
      if(err) throw err;
      console.log('Updated addon_manifest.json!')
    })
  }
}
