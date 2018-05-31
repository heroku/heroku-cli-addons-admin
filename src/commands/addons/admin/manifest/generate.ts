// heroku-cli
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import color from '@heroku-cli/color'

// other packages
import cli from 'cli-ux'
import { writeFile } from 'fs'

// utils
import generateManifest from '../../../../utils/manifest'

export default class Generate extends Command {
  static description = 'generate a manifest template'

  static examples = [ `$ oclif-example addons:admin:create_manifest
The file has been saved!`, ]

  async run() {
    const {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false})
    if (!account) {
      this.error(color.red('Please login with Heroku creditials using `heroku login`.'))
    }

    const manifest = generateManifest({}); // this function takes in an object see utils/manifest
    const manifestObj = JSON.stringify(manifest, null, 2)
    cli.action.start('Generating addon_manifest')
    writeFile('addon_manifest.json', manifestObj , (err) => {
      // console.log('Generating addon_manifest.json...')
      cli.action.stop()
      if (err) {
        console.log('The file has not been saved: \n', err);
        return;
      }
      console.log('The file has been saved!');
    });
  }
}
