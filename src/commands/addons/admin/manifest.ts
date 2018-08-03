import {Command, flags} from '@oclif/command'

export default class AddonsAdminManifest extends Command {
  static description = 'manage add-on manifests'

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    this._help();
  }
}
