import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

import AdminBase from '../../../../admin-base'
import {ReadManifest} from '../../../../manifest'

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
    const manifest: string = ReadManifest.run()

    let body = await this.addons.push(JSON.parse(manifest!))

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
