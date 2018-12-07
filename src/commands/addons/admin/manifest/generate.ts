import color from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {prompt} from 'inquirer'
import {generate as generateString} from 'randomstring'

import Addon from '../../../../addon'
import {ManifestInterface} from '../../../../manifest'

export default class Generate extends Command {
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
    let regions = body.map((r: Heroku.Region) => r.name) as string[]

    // prompts for manifest
    const filename = new Addon(this.config).local().filename()
    const promptAnswers = await this.askQuestions(filename, flags, regions)
    const manifest = this.generate(promptAnswers)
    await this.writeManifest(filename, manifest)
  }

  private slugQuestion(flags: any) {
    return {
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
      }
    }
  }

  private nameQuestion(flags: any) {
    return {
      type: 'input',
      name: 'name',
      message: 'Addon name (Name displayed to on addon dashboard):',
      default: flags.addon || 'MyAddon',
    }
  }

  private regionsQuestion(regions: string[]) {
    return {
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
      }
    }
  }

  private generateQuestion() {
    return {
      type: 'confirm',
      name: 'toGenerate',
      message: 'Would you like to generate the password and sso_salt?',
      default: true,
    }
  }

  private writeQuestion(filename: string) {
    return {
      type: 'confirm',
      name: 'toWrite',
      message: `This prompt will create/replace ${filename}. Is that okay with you?`,
      default: true
    }
  }

  private async askQuestions(filename: string, flags: any, regions: string[]): Promise<any> {
    const questions: any[] = [
      this.slugQuestion(flags),
      this.nameQuestion(flags),
      this.regionsQuestion(regions),
      this.generateQuestion(),
      this.writeQuestion(filename)
    ]

    // prompts begin here
    this.log(color.green('Input manifest information below: '))
    const promptAnswers: any = await prompt(questions)
    if (promptAnswers.toGenerate) {
      promptAnswers.password = generateString(32)
      promptAnswers.sso_salt = generateString(32)
    }
    if (!promptAnswers.toWrite) {
      this.log(`${color.green.italic(filename)} ${color.green('will not be created. Have a good day!')}`)
      this.exit()
    }
    return promptAnswers
  }

  private async writeManifest(filename: string, manifest: any) {
    // generating manifest
    const manifestObj = JSON.stringify(manifest, null, 2)
    cli.action.start('Generating add-on manifest')
    await fs.writeFile(filename, manifestObj, err => {
      cli.action.stop(color.green('done'))
      if (err) {
        this.log(`The file ${color.green(filename)} has NOT been saved! \n`, err)
        return
      }
      this.log(`The file ${color.green(filename)} has been saved!`)
    })
  }

  private generate(data: any = {}): ManifestInterface {
    let manifest: ManifestInterface = {
      id: 'myaddon',
      api: {
        config_vars_prefix: 'MYADDON',
        config_vars: [
          'MYADDON_URL'
        ],
        password: 'CHANGEME',
        sso_salt: 'CHANGEME',
        regions: ['us', 'eu'],
        requires: [],
        production: {
          base_url: 'https://myaddon.com/heroku/resources',
          sso_url: 'https://myaddon.com/sso/login'
        },
        version: '3'
      },
      name: 'MyAddon',
    }

    manifest.id = data.id || manifest.id
    manifest.api.config_vars_prefix = (data.id ? data.id.toUpperCase() : manifest.api.config_vars_prefix)
    manifest.api.config_vars = (data.id ? [`${data.id.toUpperCase()}_URL`] : manifest.api.config_vars)
    manifest.api.password = data.password || manifest.api.password
    manifest.api.sso_salt = data.sso_salt || manifest.api.sso_salt
    manifest.api.regions = data.regions || manifest.api.regions
    manifest.name = data.name || manifest.name
    return manifest
  }
}
