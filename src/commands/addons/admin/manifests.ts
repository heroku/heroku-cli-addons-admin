import {Command} from '@heroku-cli/command'
import {Args, ux} from '@oclif/core'
import * as _ from 'lodash'

import Addon from '../../../addon'

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
    ux.table(manifests, {
      Manifest: {
        get: (row: any) => row.id,
      },
      // eslint-disable-next-line perfectionist/sort-objects
      'Created At': {
        get: (row: any) => row.created_at,
      },
    })
  }
}
