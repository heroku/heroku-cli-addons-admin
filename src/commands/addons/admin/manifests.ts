import {Command} from '@heroku-cli/command'
import cli from 'cli-ux'
import * as _ from 'lodash'

import Addon from '../../../addon'

export default class AddonsAdminManifests extends Command {
  static description = 'list manifest history'

  static args = [{name: 'slug'}]

  async run() {
    const {args} = this.parse(AddonsAdminManifests)

    const addon = new Addon(this.config, args.slug)

    const body = await addon.manifests()

    const manifests = _.orderBy(body, 'created_at', 'desc')
    cli.table(manifests, {
      Manifest: {
        get: (row: any) => row.id,
      },
      'Created At': {
        get: (row: any) => row.created_at,
      },
    })
  }
}
