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
import { getEmail } from '../../../../utils/heroku';

export default class Generate extends CommandExtension {
  static description = 'generate a manifest template';

  static examples = [ `$ oclif-example addons:admin:generate
The file has been saved!`, ];

  static flags = {
    help: flags.help({char: 'h'}),
    slug: flags.string({
      char: 's',
      description: '[OPTIONAL] slugname/manifest id'
    }),
    addon: flags.string({
      char: 'a',
      description: '[OPTIONAL] addon name (name displayed to on addon dashboard)',
    })
  };

  async run() {
    const {flags} = this.parse(Generate);

    // getting Heroku user data
    let email: string | undefined = await getEmail.apply(this)

    // grab region data
    let regions: string[] = [];
    await this.axios.get('/regions')
    .then((res: any) => {
      regions = res.data.map((val: any) => {
        return val.name
      })
    })
    .catch((err: any) => {
      this.error(err);
    })


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
      type: 'checkbox',
      name: 'regions',
      message: 'Choose regions to support',
      choices: regions,
      suffix: `\n  ${color.bold('<space>')} - select\n  ${color.bold('<a>')} - toggle all\n  ${color.bold('<i>')} - invert all \n`,
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
    },
    {
      type: 'confirm',
      name: 'toWrite',
      message: 'This prompt will create/replace addon_manifest.json. Is that okay with you?',
      default: true,
    }
  ];

    // prompts begin here
    this.log(color.green('Input manifest information below: '))
    await prompt(questions).then(answers => {
      const promptAnswers = <any> answers; // asserts type to answers param
      if (promptAnswers.toGenerate) {
        promptAnswers.password = generateString(32);
        promptAnswers.sso_salt = generateString(32);
      }
      if (promptAnswers.toWrite) {
        manifest = generateManifest(promptAnswers);
      } else {
        this.log(`${color.green.italic('addon_manifest.json')}${color.green(' will not be created. Have a good day!')}`)
        this.exit()
      }
    })

    // generating manifest
    const manifestObj = JSON.stringify(manifest, null, 2);
    cli.action.start('Generating addon_manifest');
    writeFile('addon_manifest.json', manifestObj , (err) => {
      // console.log('Generating addon_manifest.json...')
      cli.action.stop(color.green('done'));
      if (err) {
        console.log(`The file ${color.green('addon_manifest.json')} has NOT been saved! \n`, err);
        return;
      }
      console.log(`The file ${color.green('addon_manifest.json')} has been saved!`);
    });
  }
}
