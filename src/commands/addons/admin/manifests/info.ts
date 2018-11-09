import {ReadManifest} from '../../../../manifest'

import AdminBase from '../../../../admin-base'

export default class AddonsAdminManifestsInfo extends AdminBase {
  static description = 'show an individual history manifest'

  static args = [{name: 'manifest', required: true}]

  async run() {
    const {args} = this.parse(AddonsAdminManifestsInfo)

    const body: any = await this.addons.manifest(ReadManifest.json().id, args.manifest)

    this.log(JSON.stringify(body, null, 2))
  }
}
