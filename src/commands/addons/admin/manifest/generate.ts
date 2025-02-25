import color from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {ux} from '@oclif/core'
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
    addon: flags.string({
      char: 'a',
      description: 'add-on name (name displayed on addon dashboard)',
    }),
    slug: flags.string({
      char: 's',
      description: 'slugname/manifest id',
    }),
  }

  async run() {
    const {flags} = await this.parse(Generate)

    // grab region data
    const {body} = await this.heroku.get<Heroku.Region[]>('/regions')
    const regions = body.map((r: Heroku.Region) => r.name) as string[]

    // prompts for manifest
    const filename = new Addon(this.config).local().filename()
    const promptAnswers = await this.askQuestions(filename, flags, regions)
    const manifest = this.generate(promptAnswers)
    await this.writeManifest(filename, manifest)
  }

  private async askQuestions(filename: string, flags: any, regions: string[]): Promise<any> {
    const questions: any[] = [
      this.slugQuestion(flags),
      this.nameQuestion(flags),
      this.regionsQuestion(regions),
      this.generateQuestion(),
      this.writeQuestion(filename),
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

  private generate(data: any = {}): ManifestInterface {
    const manifest: ManifestInterface = {
      id: 'myaddon',
      api: {
        config_vars_prefix: 'MYADDON',
        config_vars: [
          'MYADDON_URL',
        ],
        password: 'CHANGEME',
        sso_salt: 'CHANGEME',
        regions: ['us', 'eu'],
        requires: [],
        production: {
          base_url: 'https://myaddon.com/heroku/resources',
          sso_url: 'https://myaddon.com/sso/login',
        },
        version: '3',
      },
      name: 'MyAddon',
    }

    const configVarsPrefix = data.id && data.id.toUpperCase().replaceAll('-', '_')

    manifest.id = data.id || manifest.id
    manifest.api.config_vars_prefix = (configVarsPrefix ?? manifest.api.config_vars_prefix)
    manifest.api.config_vars = (configVarsPrefix ? [`${configVarsPrefix}_URL`] : manifest.api.config_vars)
    manifest.api.password = data.password || manifest.api.password
    manifest.api.sso_salt = data.sso_salt || manifest.api.sso_salt
    manifest.api.regions = data.regions || manifest.api.regions
    manifest.name = data.name || manifest.name
    return manifest
  }

  private generateQuestion() {
    return {
      default: true,
      message: 'Would you like to generate the password and sso_salt?',
      name: 'toGenerate',
      type: 'confirm',
    }
  }

  private nameQuestion(flags: any) {
    return {
      default: flags.addon || 'MyAddon',
      message: 'Addon name (Name displayed to on addon dashboard):',
      name: 'name',
      type: 'input',
    }
  }

  private regionsQuestion(regions: string[]) {
    return {
      choices: regions,
      default: ['us'],
      message: 'Choose regions to support',
      name: 'regions',
      pageSize: regions.length,
      suffix: `\n  ${color.bold('<space>')} - select\n  ${color.bold('<a>')} - toggle all\n  ${color.bold('<i>')} - invert all \n  ${color.bold('↑↓')} use arrow keys to navigate\n`,
      type: 'checkbox',
      validate: (input: any): boolean => {
        if (input.length === 0) {
          this.error('Please select at least one region.')
          return false
        }

        return true
      },
    }
  }

  private slugQuestion(flags: any) {
    return {
      default: flags.slug,
      message: 'Enter slugname/manifest id:',
      name: 'id',
      type: 'input',
      validate: (input: any): boolean => {
        if (input.trim() === '' || !isNaN(input)) {
          this.error('Please use a string as a slug name.')
          return false
        }

        return true
      },
    }
  }

  private async writeManifest(filename: string, manifest: any) {
    // generating manifest
    const manifestObj = JSON.stringify(manifest, null, 2)
    ux.action.start('Generating add-on manifest')
    await fs.writeFile(filename, manifestObj, err => {
      ux.action.stop(color.green('done'))
      if (err) {
        this.log(`The file ${color.green(filename)} has NOT been saved! \n`, err)
        return
      }

      this.log(`The file ${color.green(filename)} has been saved!`)
    })
  }

  private writeQuestion(filename: string) {
    return {
      default: true,
      message: `This prompt will create/replace ${filename}. Is that okay with you?`,
      name: 'toWrite',
      type: 'confirm',
    }
  }
}
