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

    const columns = [
      {label: 'Manfiest', key: 'id'},
      {label: 'Created At', key: 'created_at'}
    ]

    cli.table(_.orderBy(body, 'created_at', 'desc'), {columns})
  }
}
