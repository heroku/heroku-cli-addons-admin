/* tslint:disable */
import {Command} from '@heroku-cli/command'
import * as qqjs from 'qqjs';

import axiosInstance from './utils/axios';

export default abstract class CommandExtension extends Command {
  _qq:any
  _axios:any

  get qq() {
    if (this._qq) return this._qq;
    this._qq = qqjs;
    return this._qq;
  }

  get axios() {
    if (this._axios) return this._axios;
    this._axios = axiosInstance;
    return this._axios;
  }
}
