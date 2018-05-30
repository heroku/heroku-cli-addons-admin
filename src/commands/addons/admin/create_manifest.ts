// packages
import {Command, flags} from '@heroku-cli/command'
import { writeFile } from 'fs'

// other
import manifest from '../../../utils/test_manifest'

export default class CreateManifest extends Command {
  static description = 'generate a manifest template'

  async run() {
    const manifestObj = JSON.stringify(manifest, null, 2)
    writeFile('manifest_test.json', manifestObj , (err) => {
      if (err) {
        console.log('The file has not been saved: ', err);
        return;
      }
      console.log('The file has been saved!');
    });
  }
}
