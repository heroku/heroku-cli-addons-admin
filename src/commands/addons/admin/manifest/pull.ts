import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'

import AdminBase from '../../../../admin-base'
import {ReadManifest} from '../../../../manifest'

export default class Pull extends AdminBase {
  static description = 'pull a manifest for a given slug'

  static examples = [
    `$ heroku addons:admin:manifest:pull testing-123
 ...
 Fetching add-on manifest for testing-123... done
 Updating addon_manifest.json... done`,
  ]

  static args = [{name: 'slug', description: 'slug name of add-on'}]

  async run() {
    const {args} = this.parse(Pull)

    // allows users to pull without declaring slug
    const slug = ReadManifest.slug(args.slug)
    const body = await this.addons.pull(slug)

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
