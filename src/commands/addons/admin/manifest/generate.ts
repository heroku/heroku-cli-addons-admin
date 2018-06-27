// CommandExtension
import CommandExtension from '../../../../CommandExtension';

// heroku-cli
import {Command, flags} from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import color from '@heroku-cli/color';

// other packages
import cli from 'cli-ux';
import { writeFile } from 'fs';
import { prompt } from 'inquirer';
import { generate as generateString } from 'randomstring';

// utils
import generateManifest from '../../../../utils/manifest';

export default class Generate extends CommandExtension {
  static description = 'generate a manifest template';

  static examples = [ `$ oclif-example addons:admin:generate
The file has been saved!`, ];

  static flags = {
    help: flags.help({char: 'h'}),
    slug: flags.string({
      char: 's',
      description: 'slugname/manifest id'
    }),
    addon: flags.string({
      char: 'a',
      description: 'addon name (name displayed to on addon dashboard)',
    })
  };

  async run() {
    const {flags} = this.parse(Generate);
    const {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false});

    // checks if user is logged in, in case default user checking measures do not work
    if (!account) {
      this.error(color.red('Please login with Heroku credentials using `heroku login`.'));
    }

    // prompts for manifest
    let manifest = generateManifest();
    this.log(color.green('Input manifest information below: '))
    const questions = [{
      type: 'input',
      name: 'id',
      message: 'Enter slugname/manifest id:',
      default: flags.slug,
      validate: (input: any): boolean => {
        if (input.trim() === '' || !isNaN(input)) {
          this.error('Please use a string as a slug name.')
          return false;
        }
        return true;
      },
    }, {
      type: 'input',
      name: 'name',
      message: 'Addon name (Name displayed to on addon dashboard):',
      default: flags.addon || 'MyAddon',
    }, {
      type: 'checkbox',
      name: 'regions',
      message: 'Choose regions to support',
      choices: ['us', 'eu', 'dublin', 'frankfurt', 'oregan', 'sydney', 'tokyo', 'virginia'],
      validate: (input: any): boolean => {
        if (input.length < 1) {
          this.error('Please select at least one region.');
          return false;
        }
        return true;
      },
    }, {
      type: 'confirm',
      name: 'toGenerate',
      message: 'Would you like to generate the password and sso_salt?',
      default: true,
    }];
    await prompt(questions).then(answers => {
      const promptAnswers = <any> answers;
      if (promptAnswers.toGenerate) {
        promptAnswers.password = generateString(32);
        promptAnswers.sso_salt = generateString(32);
      }
      manifest = generateManifest(promptAnswers);
    })

    // generating manifest
    const manifestObj = JSON.stringify(manifest, null, 2);
    cli.action.start('Generating addon_manifest');
    writeFile('addon_manifest.json', manifestObj , (err) => {
      // console.log('Generating addon_manifest.json...')
      cli.action.stop(color.green('done'));
      if (err) {
        console.log('The file has not been saved: \n', err);
        return;
      }
      console.log('The file has been saved!');
    });
  }
}
