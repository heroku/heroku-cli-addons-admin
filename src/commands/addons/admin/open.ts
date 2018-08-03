/* tslint:disable */
// CommandExtension
import CommandExtension from '../../../CommandExtension';

// other packages
import cli from 'cli-ux';

// utilities
import { readManifest } from '../../../utils/manifest';

export default class AddonsAdminOpen extends CommandExtension {
  static description = 'open add-on dashboard'

  async run() {
    cli.action.start('Checking addon_manifest.json')
    const manifest = readManifest.apply(this)
    cli.action.stop()

    const slug: string = JSON.parse(manifest).id;
    cli.open(`https://addons-next.heroku.com/addons/${slug}`)
  }
}
