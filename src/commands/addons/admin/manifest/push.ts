import {Command} from '@heroku-cli/command'

import Addon from '../../../../addon'

export default class Push extends Command {
  static description = 'update remote manifest'

  static examples = [
    `$ heroku addons:admin:manifest:push
 ...
 Pushing manifest... done
 Updating addon-manifest.json... done`,
  ]

  async run() {
    const addon = new Addon(this.config)
    const manifest = addon.local()

    const remoteManifest = addon.remote()
    await remoteManifest.set(await manifest.get())

    await manifest.set(await remoteManifest.get())
    await manifest.log()
  }
}
