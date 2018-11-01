import cli from 'cli-ux'
import color from '@heroku-cli/color'
import {Command} from '@heroku-cli/command'
import {diffLines} from 'diff'

import AdminBase from '../../../../admin_base'

export default class Diff extends Command {
  static description = 'compares remote manifest to local manifest and finds differences'

  async run() {
    // reading current manifest
    const manifest: string = AdminBase.readManifest()
    const slug: string = JSON.parse(manifest!).id

    // GET request
    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`)
    let {body} = await this.addons.get(`/provider/addons/${slug}`)
    cli.action.stop()
    const fetchedManifest = JSON.stringify(body, null, 2)

    const diff = diffLines(fetchedManifest, manifest, {newlineIsToken: true, ignoreCase: true})

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
