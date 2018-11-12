import {flags} from '@heroku-cli/command'

import AdminBase from '../../../../admin-base'
import {ReadManifest} from '../../../../manifest'

export default class AddonsAdminManifestsInfo extends AdminBase {
  static description = 'show an individual history manifest'

  static args = [{name: 'slug'}]

  static flags = {
    manifest: flags.string({
      char: 'm',
      required: true,
      description: 'manifest history id'
    })
  }

  async run() {
    const {args, flags} = this.parse(AddonsAdminManifestsInfo)

    const slug = ReadManifest.slug(args.slug)
    const body: any = await this.addons.manifest(slug, flags.manifest)

    this.log(JSON.stringify(body, null, 2))
  }
}
