// CommandExtension
import CommandExtension from '../../../../CommandExtension';

// heroku-cli
import {Command, flags} from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import color from '@heroku-cli/color';

// interfaces
import { ManifestInterface } from '../../../../utils/manifest';

// other packages
import cli from 'cli-ux';
import { readFileSync, writeFileSync } from 'fs';
import { prompt } from 'inquirer';

export default class Push extends CommandExtension {
  static description = 'push created manifest';

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'slug'}];

  static examples = [
    `$ heroku addons:admin:manifest:push
 ...
 Pushing manifest... done
 Updating addon_manifest.json... done`, ];


  async run() {
    const {args, flags} = this.parse(Push);

    // don't continue without args
    if (!args.slug) {
      this.error('Please include slug argument.')
    }

    // getting Heroku user data
    let {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false});
    let email = account.email;

    const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

    // grabbing manifest data
    let manifest: string = readFileSync('addon_manifest.json', 'utf8');
    if (!manifest) {
      this.error('No manifest found. Please generate a manifest before pushing.');
    }

    // fetching recent manifest data to check if $base is up to date
    cli.action.start('Fetching and checking recent manifest data');
    let fetchOptions = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      }
    };
    let manifestJSON: ManifestInterface = JSON.parse(manifest);
    const slug = args.slug;
    const fetchRequest = await this.heroku.get<any>(`${host}/provider/addons/${slug}`, fetchOptions);
    const fetchBody: ManifestInterface = fetchRequest.body;
    cli.action.stop(color.green('done ✓')); // start @ line 54

    // incorrect $base caught here
    if (manifestJSON.$base !== fetchBody.$base) {
      this.log(`${color.yellow('Warning:')} Incorrect $base caught. Will need to fetch $base.`)
      await prompt({
       type: 'list',
       message: 'Press OK to continue.',
       name: 'data',
       choices: ['OK', 'Cancel']
     }).then(answers => {
       if (answers.data === 'Cancel') {
         this.exit(1);
       }
     })

      // writing addon_manifest.json when $base is incorrect
      const newManifest: object = {
        id: fetchBody.id,
        name: fetchBody.name,
        ...fetchBody
      };
      cli.action.start(`Fixing ${color.blue('addon_manifest.json')}`);
      writeFileSync('addon_manifest.json', JSON.stringify(newManifest, null, 2));

      // grabbing manifest data to get correct $base
      manifest = readFileSync('addon_manifest.json', 'utf8');
      if (!manifest) {
        this.error('No manifest found. Please generate a manifest before pushing.');
      }
      manifestJSON = JSON.parse(manifest)
      cli.action.stop(color.green('done ✓')); // start @ line 89
    }


    // headers and data to sent addons API via http request
    let defaultOptions: object = {
      headers: {
        authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'kensa future'
      },
      body: manifestJSON
    };

    // POST request
    cli.action.start(`Pushing manifest`);
    const {body} = await this.heroku.post<any>(`${host}/provider/addons`, defaultOptions);
    cli.action.stop(color.green('done ✓')); // start @ line 103

    // writing addon_manifest.json
    const newManifest: ManifestInterface = {
      id: body.id,
      name: body.name,
      ...body
    };
    cli.action.start(`Updating ${color.blue('addon_manifest.json')}`);
    writeFileSync('addon_manifest.json', JSON.stringify(newManifest, null, 2));
    cli.action.stop(color.green('done ✓')); // start @ line 113

    console.log(color.bold(JSON.stringify(newManifest, null, 1)));
  }
}
