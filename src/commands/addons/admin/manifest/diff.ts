import {Command} from '@heroku-cli/command'
import {color} from '@heroku/heroku-cli-util'
import {diffLines} from 'diff'

import Addon from '../../../../addon.js'

export default class Diff extends Command {
  static description = 'compares remote manifest to local manifest and finds differences'

  async run() {
    const addon = new Addon(this.config)

    const body = await addon.remote().get()

    const fetchedManifest = JSON.stringify(body, null, 2)
    const localManifest = await addon.local().get()
    const localManifestString = JSON.stringify(localManifest, null, 2)
    const diff = diffLines(fetchedManifest, localManifestString, {newlineIsToken: true})
    for (const substr of diff) {
      let message: string
      if (substr.added) {
        message = color.green(color.bold(substr.value))
      } else if (substr.removed) {
        message = color.red(substr.value)
      } else {
        message = substr.value
      }

      this.log(message)
    }
  }
}
