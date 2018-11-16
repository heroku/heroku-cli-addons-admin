import {Command} from '@heroku-cli/command'

import Addon from '../../../../addon'

export default class Pull extends Command {
  static description = 'pull a manifest for a given slug'

  static examples = [
    `$ heroku addons:admin:manifest:pull testing-123
 ...
 Fetching add-on manifest for testing-123... done
 Updating addon-manifest.json... done`,
  ]

  static args = [{name: 'slug', description: 'slug name of add-on'}]

  async run() {
    const {args} = this.parse(Pull)

    const addon = new Addon(this.config, args.slug)
    const manifest = addon.local()

    await manifest.set(await addon.remote().get())
    await manifest.log()
  }
}
