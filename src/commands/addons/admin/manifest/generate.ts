/* tslint:disable */
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
import { generateManifest } from '../../../../utils/manifest';

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
    }),
    template: flags.boolean({
      char: 't',
      description: 'generates manifest with default options'
    }),
  };

  async run() {
    const {flags} = this.parse(Generate);

    // prompts for manifest
    let manifest = generateManifest();
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
      type: 'confirm',
      name: 'toGenerate',
      message: 'Would you like to generate the password and sso_salt?',
      default: true,
    }];
    if (!flags.template) {
      this.log(color.green('Input manifest information below: '))
      await prompt(questions).then(answers => {
        const promptAnswers = <any> answers; // asserts type to answers param
        if (promptAnswers.toGenerate) {
          promptAnswers.password = generateString(32);
          promptAnswers.sso_salt = generateString(32);
        }
        manifest = generateManifest(answers);
      })
    } else {
      manifest = generateManifest({
        id: 'testing-123',
        name: 'MyAddon',
        password: generateString(32),
        sso_salt: generateString(32)
      });
    }

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
