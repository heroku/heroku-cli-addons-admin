import {Command, flags} from '@heroku-cli/command'
import {Args} from '@oclif/core'

import Addon from '../../../../addon'

export default class AddonsAdminManifestsInfo extends Command {
  static args = {
    slug: Args.string({description: 'slug name of add-on'}),
  }

  static description = 'show an individual history manifest'

  static flags = {
    manifest: flags.string({
      char: 'm',
      description: 'manifest history id',
      required: true,
    }),
  }

  async run() {
    const {args, flags} = await this.parse(AddonsAdminManifestsInfo)

    const addon = new Addon(this.config, args.slug)

    const body: any = await addon.manifest(flags.manifest)

    this.log(JSON.stringify(body, null, 2))
  }
}
