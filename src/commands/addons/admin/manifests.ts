import {Command} from '@heroku-cli/command'
import {hux} from '@heroku/heroku-cli-util'
import {Args} from '@oclif/core'
import _ from 'lodash'

import Addon from '../../../addon.js'

export default class AddonsAdminManifests extends Command {
  static args = {
    slug: Args.string({description: 'slug name of add-on'}),
  }
  static description = 'list manifest history'

  async run() {
    const {args} = await this.parse(AddonsAdminManifests)

    const addon = new Addon(this.config, args.slug)

    const body = await addon.manifests()

    const manifests = _.orderBy(body, 'created_at', 'desc')
    hux.table(manifests as unknown as Record<string, unknown>[], {
      id: {header: 'Manifest'},
      created_at: {header: 'Created At'},
    })
  }
}
