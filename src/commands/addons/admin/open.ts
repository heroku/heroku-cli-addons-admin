import {Command} from '@heroku-cli/command'
import cli from 'cli-ux'

import Addon from '../../../addon'

export default class Open extends Command {
  static description = 'open add-on dashboard'

  static args = [{name: 'slug', description: 'slug name of add-on'}]

  static examples = [
    `$ heroku addons:admin:open
Checking addon-manifest.json... done
Opening https://addons-next.${process.env.HEROKU_HOST || 'heroku.com'}/addons/testing-123... done`,
  ]

  async run() {
    const {args} = this.parse(Open)

    const addon = new Addon(this.config, args.slug)
    const slug = await addon.slug()
    const herokuHost = process.env.HEROKU_HOST || 'heroku.com'
    const url = `https://addons-next.${herokuHost}/addons/${slug}`

    cli.action.start(`Opening ${url}`)
    await cli.open(url)
    cli.action.stop()
  }
}
