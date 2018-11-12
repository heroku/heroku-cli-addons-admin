import cli from 'cli-ux'
import * as _ from 'lodash'

import AdminBase from '../../../admin-base'
import {ReadManifest} from '../../../manifest'

export default class AddonsAdminManifests extends AdminBase {
  static description = 'list manifest history'

  async run() {
    let body: any = await this.addons.manifests(ReadManifest.json().id)

    const columns = [
      {label: 'Manfiest', key: 'id'},
      {label: 'Created At', key: 'created_at'}
    ]

    cli.table(_.orderBy(body, 'created_at', 'desc'), {columns})
  }
}
