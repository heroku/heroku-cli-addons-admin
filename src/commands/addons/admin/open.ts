/* tslint:disable */
// CommandExtension
import CommandExtension from '../../../CommandExtension';

// other packages
import cli from 'cli-ux';

// utilities
import { readManifest } from '../../../utils/manifest';

export default class Open extends CommandExtension {
  static description = 'open add-on dashboard'

  static args = [{name: 'slug',  description: 'slug name of add-on'}];


  async run() {
    const {args} = this.parse(Open);

    let slug: string;

    // check if user gave slug argument
    if (args.slug) {
      slug = args.slug
    } else {
      // if not use slug specified in manifest
      cli.action.start('Checking addon_manifest.json')
      const manifest = readManifest.apply(this)
      cli.action.stop()

      slug = JSON.parse(manifest).id;
    }

    cli.open(`https://addons-next.heroku.com/addons/${slug}`)
  }
}
