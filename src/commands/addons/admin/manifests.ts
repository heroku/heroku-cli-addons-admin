import cli from 'cli-ux'

import AdminBase from '../../../admin-base'
import {ReadManifest} from '../../../manifest'

export default class AddonsAdminManifests extends AdminBase {
  static description = 'show history manifest listing'

  async run() {
    const body: any = await this.addons.manifests(ReadManifest.json().id)
    body.sort((a: any, b: any) => a.created_at < b.created_at)

    const columns = [
      {label: 'Manfiest', key: 'id'},
      {label: 'Created At', key: 'created_at'}
    ]

    cli.table(body, {columns})
  }
}
