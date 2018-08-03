/* tslint:disable */
import {Command, flags} from '@oclif/command'

export default class AddonsAdmin extends Command {
  static description = 'create and manage add-ons'

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    this._help();
  }
}
