import color from '@heroku-cli/color'
import {Command} from '@heroku-cli/command'
import {diffLines} from 'diff'

import Addon from '../../../../addon'

export default class Diff extends Command {
  static description = 'compares remote manifest to local manifest and finds differences'

  async run() {
    const addon = new Addon(this.config)

    // reading current manifest
    const body = await addon.remote().get()

    const fetchedManifest = JSON.stringify(body, null, 2)
    const localManifest = await addon.local().get()
    const localManifestString = JSON.stringify(localManifest, null, 2)
    const diff = diffLines(fetchedManifest, localManifestString, {ignoreCase: true, newlineIsToken: true})
    diff.forEach((substr: any) => {
      let outputColor: 'green' | 'red' | 'white' = 'white'
      if (substr.added) {
        outputColor = 'green' // this is supposed to be a bold green (chalk.green.bold)
      } else if (substr.removed) {
        outputColor = 'red'
      }

      let message: string = color[outputColor](substr.value)
      if (outputColor === 'green') {
        message = color.italic.bold(message)
      }

      this.log(message)
    })
  }
}
