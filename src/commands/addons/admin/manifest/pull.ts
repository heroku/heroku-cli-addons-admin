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
    let slug = args.slug
    if (!args.slug) {
      try {
        let manifest = ReadManifest.run()
        const manifestJSON = JSON.parse(manifest!)
        if (manifestJSON.id) {
          slug = manifestJSON.id
        } else {
          this.error('No slug found.')
        }
      } catch {
        this.error('No manifest or slug found. Please pull with slug name.')
      }
    }

    // GET request
    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
    let {body} = await this.addons.get(`/provider/addons/${slug}`)
      // if (err) {
      //   if (slug) {
      //     this.error(`Unable to make get data on a slug with the name of ${color.blue(slug)}`)
      //   } else {
      //     this.error('Please make sure you have a slug.')
      //   }
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
