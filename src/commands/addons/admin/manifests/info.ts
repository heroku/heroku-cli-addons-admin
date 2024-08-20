import {Command, flags} from '@heroku-cli/command'

import Addon from '../../../../addon'

export default class AddonsAdminManifestsInfo extends Command {
  static description = 'show an individual history manifest'

  static args = [{name: 'slug'}]

  static flags = {
    manifest: flags.string({
      char: 'm',
      required: true,
      description: 'manifest history id',
    }),
  }

  async run() {
    const {args, flags} = this.parse(AddonsAdminManifestsInfo)

    const addon = new Addon(this.config, args.slug)

    const body: any = await addon.manifest(flags.manifest)

    this.log(JSON.stringify(body, null, 2))
  }
}
