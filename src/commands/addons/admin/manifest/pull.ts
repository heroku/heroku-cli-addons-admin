import {Command} from '@heroku-cli/command'
import {Args} from '@oclif/core'

import Addon from '../../../../addon'

export default class Pull extends Command {
  static args = {
    slug: Args.string({
      required: true,
      description: 'slug name of add-on',
    }),
  }

  static description = 'pull a manifest for a given slug'

  static examples = [
    `$ heroku addons:admin:manifest:pull testing-123
 ...
 Fetching add-on manifest for testing-123... done
 Updating addon-manifest.json... done`,
  ]


  async run() {
    const {args} = await this.parse(Pull)

    const addon = new Addon(this.config, args.slug)
    const manifest = addon.local()

    await manifest.set(await addon.remote().get())
    await manifest.log()
  }
}
