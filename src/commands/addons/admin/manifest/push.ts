import AdminBase from '../../../../admin-base'
import {LogManifest, ReadManifest, WriteManifest} from '../../../../manifest'

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
    const body = await this.addons.push(ReadManifest.json())

    LogManifest.run(body)

    WriteManifest.run(body)
  }
}
