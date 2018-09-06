/* tslint:disable */
// CommandExtension
import CommandExtension from '../../../../CommandExtension';

// heroku-cli
import {Command, flags} from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import color from '@heroku-cli/color';

// other packages
import cli from 'cli-ux';
import { readFileSync, writeFileSync } from 'fs';

// utilities
import { getEmail } from '../../../../utils/heroku';
import { readManifest } from '../../../../utils/manifest';

export default class Pull extends CommandExtension {
  static description = 'pull a manifest for a given slug';

  static examples = [
    `$ heroku addons:admin:manifest:pull testing-123
 ...
 Fetching add-on manifest for testing-123... done
 Updating addon_manifest.json... done`, ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'slug',  description: 'slug name of add-on'}];

  async run() {
    const {args, flags} = this.parse(Pull);

    // getting Heroku user data
    let email: string | undefined = await getEmail.apply(this);

    // headers and data to sent addons API via http request
    let defaultOptions = {
      headers: {
        'Authorization': `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      }
    };
    // allows users to pull without declaring slug
    let slug = args.slug;
    if (!args.slug) {
      try {
        let manifest: string = readManifest.apply(this);
        const manifestJSON = JSON.parse(manifest);
        if(manifestJSON.id) {
          slug = manifestJSON.id;
        } else {
          this.error('No slug found in the manifest.');
        }
      } catch (err) {
        this.error('No manifest found. Please pull with slug.');
      }
    }
    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

    // GET request
    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`);

    let body: any;
    await this.axios.get(`${host}/provider/addons/${slug}`, defaultOptions)
    .then((res: any) => {
      body = res.data;
    })
    .catch((err:any) => {
      if (err) {
        if (slug) {
          this.error(`Unable to fetch manifest for add-on ${color.blue(slug)}`)
        } else {
          this.error('Please make sure you have provided a slug to fetch.')
        }
      }
    })
    cli.action.stop();

    // writing addon_manifest.json
    const newManifest: object = {
      ...body
    };
    console.log(color.bold(JSON.stringify(newManifest, null, 1)));
    cli.action.start(`Updating ${color.blue('addon_manifest.json')}`);
    writeFileSync('addon_manifest.json', JSON.stringify(newManifest, null, 2));
    cli.action.stop();
  }
}
