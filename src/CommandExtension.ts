/* tslint:disable */
import {Command} from '@heroku-cli/command'
import * as qqjs from 'qqjs';

export default abstract class CommandExtension extends Command {
  _qq:any
  get qq() {
    if (this._qq) return this._qq;
    this._qq = qqjs;
    return this._qq;
  }
}
