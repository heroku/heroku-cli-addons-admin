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

  static examples = [
`$ heroku addons:admin:open
Checking addon_manifest.json... done
Opening https://addons-next.heroku.com/addons/testing-123... done`, ];


  async run() {
    const {args} = this.parse(Open);

    let slug: string;

    // check if user gave slug argument
    if (args.slug) {
      slug = args.slug
    } else {
      // if not use slug specified in manifest
      cli.action.start('Checking addon_manifest.json')
      const manifest = await readManifest.apply(this)
      cli.action.stop()

      slug = JSON.parse(manifest).id;
    }

    const url = `https://addons-next.heroku.com/addons/${slug}`

    cli.action.start(`Opening ${url}`)
    cli.open(url)
    cli.action.stop()
  }
}
