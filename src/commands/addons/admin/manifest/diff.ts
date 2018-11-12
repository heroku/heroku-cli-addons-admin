import color from '@heroku-cli/color'
import {diffLines} from 'diff'

import AdminBase from '../../../../admin-base'
import {ReadManifest} from '../../../../manifest'

export default class Diff extends AdminBase {
  static description = 'compares remote manifest to local manifest and finds differences'

  async run() {
    // reading current manifest
    const body = await this.addons.pull(ReadManifest.json().id)
    const fetchedManifest = JSON.stringify(body, null, 2)

    const diff = diffLines(fetchedManifest, ReadManifest.run(), {newlineIsToken: true, ignoreCase: true})

    diff.forEach((substr: any) => {
      let outputColor: 'white' | 'green' | 'red' = 'white'
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
