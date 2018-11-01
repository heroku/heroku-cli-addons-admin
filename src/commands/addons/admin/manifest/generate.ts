import color from '@heroku-cli/color'
import {flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {prompt} from 'inquirer'
import {generate as generateString} from 'randomstring'

import AdminBase from '../../../../admin-base'
import {GenerateManifest} from '../../../../manifest'

export default class Generate extends AdminBase {
  static description = 'generate a manifest template'

  static examples = [
    `$ heroku addons:admin:generate
The file has been saved!`,
  ]

  static flags = {
    slug: flags.string({
      char: 's',
      description: 'slugname/manifest id'
    }),
    addon: flags.string({
      char: 'a',
      description: 'add-on name (name displayed on addon dashboard)',
    })
  }

  async run() {
    const {flags} = this.parse(Generate)

    // grab region data
    let {body} = await this.heroku.get<Heroku.Region[]>('/regions')
    let regions = body.map((r: Heroku.Region) => r.name)

    // prompts for manifest
    let manifest = GenerateManifest.run()
    const questions: any[] = [{
      type: 'input',
      name: 'id',
      message: 'Enter slugname/manifest id:',
      default: flags.slug,
      validate: (input: any): boolean => {
        if (input.trim() === '' || !isNaN(input)) {
          this.error('Please use a string as a slug name.')
          return false
        }
        return true
      },
    }, {
      type: 'input',
      name: 'name',
      message: 'Addon name (Name displayed to on addon dashboard):',
      default: flags.addon || 'MyAddon',
    }, {
      type: 'checkbox',
      name: 'regions',
      default: ['us'],
      pageSize: regions.length,
      message: 'Choose regions to support',
      choices: regions,
      suffix: `\n  ${color.bold('<space>')} - select\n  ${color.bold('<a>')} - toggle all\n  ${color.bold('<i>')} - invert all \n  ${color.bold('↑↓')} use arrow keys to navigate\n`,
      validate: (input: any): boolean => {
        if (input.length < 1) {
          this.error('Please select at least one region.')
          return false
        }
        return true
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
    ]

    // prompts begin here
    this.log(color.green('Input manifest information below: '))
    await prompt(questions).then((answers: any) => {
      const promptAnswers = answers as any // asserts type to answers param
      if (promptAnswers.toGenerate) {
        promptAnswers.password = generateString(32)
        promptAnswers.sso_salt = generateString(32)
      }
      if (promptAnswers.toWrite) {
        manifest = GenerateManifest.run(promptAnswers)
      } else {
        this.log(`${color.green.italic('addon_manifest.json')}${color.green(' will not be created. Have a good day!')}`)
        this.exit()
      }
    })

    // generating manifest
    const manifestObj = JSON.stringify(manifest, null, 2)
    cli.action.start('Generating addon_manifest')
    await fs.writeFile('addon_manifest.json', manifestObj, err => {
      cli.action.stop(color.green('done'))
      if (err) {
        this.log(`The file ${color.green('addon_manifest.json')} has NOT been saved! \n`, err)
        return
      }
      this.log(`The file ${color.green('addon_manifest.json')} has been saved!`)
    })
  }
}
