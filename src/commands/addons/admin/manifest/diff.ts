// CommandExtension
import CommandExtension from '../../../../CommandExtension';

// heroku-cli
import color from '@heroku-cli/color';
import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';

// other packages
import cli from 'cli-ux';
import { readFileSync } from 'fs';
import { prompt } from 'inquirer';
import { diffLines } from 'diff';


export default class Diff extends CommandExtension {
  static description = 'compares remote manifest to local manifest and finds differences'

  async run() {
    const {args, flags} = this.parse(Diff)
    const {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false});

    // checks if user is logged in, in case default user checking measures do not work
    if (!account) {
      this.error(color.red('Please login with Heroku credentials using `heroku login`.'));
    }
    let email = account.email;

    // reading current manifest
    const manifest: string = readFileSync('addon_manifest.json', 'utf8');
    if (!manifest) {
      this.error('No manifest found. Please generate a manifest before pushing.');
    }
    const slug: string = JSON.parse(manifest).id;

    // GET request
    cli.action.start(`Fetching add-on manifest for ${color.addon(slug)}`);
    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';
    let defaultOptions = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      }
    };

    const {body} = await this.heroku.get<any>(`${host}/provider/addons/${slug}`, defaultOptions); // manifest fetched
    cli.action.stop();
    const fetchedManifest = JSON.stringify(body, null, 2)

    const diff = diffLines(fetchedManifest,manifest, { newlineIsToken: true });

    this.log(`${color.yellow('Disclaimer:')} Some values may be repeated, but are in different positions.`)
    diff.forEach(part => {
      const outputColor = part.added ? 'green' :
                    part.removed ? 'red' : 'white';
      console.log(color[outputColor](part.value));
    })
  }
}
