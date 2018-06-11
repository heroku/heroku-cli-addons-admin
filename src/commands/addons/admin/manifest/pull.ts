// CommandExtension
import CommandExtension from '../../../../CommandExtension';

// heroku-cli
import {Command, flags} from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import color from '@heroku-cli/color';

// other packages
import cli from 'cli-ux';
import { writeFileSync } from 'fs';

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

  static args = [{name: 'slug'}];

  async run() {
    const {args, flags} = this.parse(Pull);

    // getting Heroku user data
    let {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false});
    let email = account.email;

    // headers and data to sent addons API via http request
    let defaultOptions = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      }
    };
    const slug = args.slug;
    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

    // GET request
    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`);

    const {body} = await this.heroku.get<any>(`${host}/provider/addons/${slug}`, defaultOptions);
    console.log(color.bold(JSON.stringify(body, null, 1)));
    cli.action.stop();

    // writing addon_manifest.json
    cli.action.start(`Updating ${color.blue('addon_manifest.json')}`);
    writeFileSync('addon_manifest.json', JSON.stringify(body, null, 2));
    cli.action.stop();
  }
}
