import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

import AdminBase from '../../../../admin-base'

export default class Push extends AdminBase {
  static description = 'update remote manifest'

  static examples = [
    `$ heroku addons:admin:manifest:push
 ...
 Pushing manifest... done
 Updating addon_manifest.json... done`,
  ]

  async run() {
    // grabbing manifest data
    const manifest: string = this.readLocalManifest!

    // POST request
    cli.action.start('Pushing manifest')
    let {body} = await this.addons.post('/provider/addons', JSON.parse(manifest!))
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
