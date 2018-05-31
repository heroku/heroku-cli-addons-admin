// packages
import {Command, flags} from '@heroku-cli/command'
import { writeFile } from 'fs'

// other
import generateManifest from '../../../../utils/manifest'

export default class Generate extends Command {
  static description = 'generate a manifest template'

  static examples = [ `$ oclif-example addons:admin:create_manifest
The file has been saved!`, ]

  async run() {
    const manifest = generateManifest();
    const manifestObj = JSON.stringify(manifest, null, 2)
    writeFile('addon_manifest.json', manifestObj , (err) => {
      console.log('Generating addon_manifest.json...')
      if (err) {
        console.log('The file has not been saved: \n', err);
        return;
      }
      console.log('The file has been saved!');
    });
  }
}
