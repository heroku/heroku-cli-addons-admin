import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

import AdminBase from '../../../../admin_base'

export default class Push extends AdminBase {
  static description = 'update remote manifest'

  static flags = {}

  static examples = [
    `$ heroku addons:admin:manifest:push
 ...
 Pushing manifest... done
 Updating addon_manifest.json... done`,
  ]

  async run() {
    const {args, flags} = this.parse(Push)

    // getting Heroku user data
    let email: string | undefined = await getEmail.apply(this)

    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

    // grabbing manifest data
    const manifest: string = readManifest.apply(this)

    // headers and data to sent addons API via http request
    let defaultOptions: object = {
      headers: {
        Authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'kensa future'
      },
      body: JSON.parse(manifest)
    }

    // POST request
    cli.action.start('Pushing manifest')
    let {body} = await this.addons.post('/provider/addons', JSON.parse(manifest))
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

    // writing addon_manifest.json
    const newManifest = {
      ...body
    }
    this.log(color.bold(JSON.stringify(newManifest, null, 1)))
    cli.action.start(`Updating ${color.blue('addon_manifest.json')}`)
    fs.writeFileSync('addon_manifest.json', JSON.stringify(newManifest, null, 2))
    cli.action.stop()
  }
}
