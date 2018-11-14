import {APIClient} from '@heroku-cli/command'
import cli from 'cli-ux'
import * as _ from 'lodash'
import * as url from 'url'

export default class AddonClient {
  private readonly client: APIClient

  private readonly options: any = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'kensa future',
      Accept: 'application/json'
    }
  }

  constructor(config: any) {
    const client = new APIClient(config, {})
    const host = process.env.HEROKU_ADDONS_HOST
    client.defaults.host = host ? url.parse(host).host : 'addons.heroku.com'

    this.client = client
  }

  async get(path: string): Promise<any> {
    try {
      const response = await this.client.get(path, this.options)
      return response.body
    } catch (err) {
      const error = _.get(err, 'body.error')
      if (error) {
        cli.error(error)
      }
      throw err
    }
  }

  async post(path: string, requestBody: any): Promise<any> {
    try {
      let opts = {
        ...this.options,
        body: requestBody
      }
      const response = await this.client.post(path, opts)
      return response.body
    } catch (err) {
      const baseErrors = _.get(err, 'body.error.base')
      if (baseErrors) {
        cli.error(baseErrors.join(', '))
      }
      const error = _.get(err, 'body.error')
      if (error) {
        cli.error(error)
      }
      throw err
    }
  }
}
