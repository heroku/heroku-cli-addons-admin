// CommandExtension
import CommandExtension from '../../../../CommandExtension';

// heroku-cli
import {Command, flags} from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import color from '@heroku-cli/color';

// other packages
import cli from 'cli-ux';
import { readFileSync, writeFileSync } from 'fs';

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
    let {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false});
    let email = account.email;

    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

    // grabbing manifest data
    const manifest: string = readFileSync('addon_manifest.json', 'utf8');
    if (!manifest) {
      this.error('No manifest found. Please generate a manifest before pushing.');
    }

    // headers and data to sent addons API via http request
    let defaultOptions: object = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      },
      body: JSON.parse(manifest)
    };

    // POST request
    cli.action.start(`Pushing manifest`);
    const {body} = await this.heroku.post<any>(`${host}/provider/addons`, defaultOptions);
    console.log(body);
    cli.action.stop();

    // writing addon_manifest.json
    cli.action.start(`Updating ${color.blue('addon_manifest.json')}`);
    writeFileSync('addon_manifest.json', JSON.stringify(body, null, 2));
    cli.action.stop();
  }
}
