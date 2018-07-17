/* tslint:disable */
import {Command} from '@heroku-cli/command'
import * as qqjs from 'qqjs';

// import axiosInstance from './utils/axios';
import axios from 'axios';

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
    this._axios = axios.create({
      baseURL: 'https://api.heroku.com',
      headers: {
        'Authorization': `Bearer ${this.heroku.auth}`,
        'content-type': 'application/json',
        Accept: 'application/vnd.heroku+json; version=3',
        version: 3,
      }
    });
    return this._axios;
  }
}
