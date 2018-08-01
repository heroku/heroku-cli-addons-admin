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

export default class Push extends CommandExtension {
  static description = 'push created manifest';

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static examples = [
    `$ heroku addons:admin:manifest:push
 ...
 Pushing manifest... done
 Updating addon_manifest.json... done`, ];


  async run() {
    const {args, flags} = this.parse(Push);

    // getting Heroku user data
    let email: string | undefined = await getEmail.apply(this)

    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

    // grabbing manifest data
    const manifest: string = readManifest.apply(this);

    // headers and data to sent addons API via http request
    let defaultOptions: object = {
      headers: {
        'Authorization': `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      },
      body: JSON.parse(manifest)
    };

    // POST request
    cli.action.start(`Pushing manifest`);
    let body: any = undefined;
    await this.axios.post(`${host}/provider/addons`, JSON.parse(manifest), defaultOptions)
    .then((res: any) => {
      body = res.data;
    })
    .catch((err: any) => {
      if (err) this.error(err)
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
