import AdminBase from '../../../../admin-base'
import {LogManifest, ReadManifest, WriteManifest} from '../../../../manifest'

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

    LogManifest.run(body)

    WriteManifest.run(body)
  }
}
