import {Command} from '@heroku-cli/command'
import {Args} from '@oclif/core'
import {printTable} from '@oclif/table'
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
    printTable({
      columns: [
        {key: 'Manifest'},
        {key: 'Created At'},
      ],
      data: manifests.map((row: any) => ({
        'Created At': row.created_at,
        Manifest: row.id,
      })),
    })
  }
}
