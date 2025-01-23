import {Command} from '@heroku-cli/command'
import {Args, ux} from '@oclif/core'
import * as open from 'open'
import Addon from '../../../addon'

export default class Open extends Command {
  static description = 'open add-on dashboard'
  
  static args = {
    slug: Args.string({description: 'slug name of add-on'}),
  }
  
  static examples = [
    `$ heroku addons:admin:open
    Checking addon-manifest.json... done
    Opening https://addons-next.${process.env.HEROKU_HOST || 'heroku.com'}/addons/testing-123... done`,
  ]
  
  static urlOpener: (url: string) => Promise<unknown> = open
  
  async run() {
    const {args} = await this.parse(Open)

    const addon = new Addon(this.config, args.slug)
    const slug = await addon.slug()
    const herokuHost = process.env.HEROKU_HOST || 'heroku.com'
    const url = `https://addons-next.${herokuHost}/addons/${slug}`

    ux.action.start(`Opening ${url}`)
    await Open.urlOpener(url)
    ux.action.stop()
  }
}
