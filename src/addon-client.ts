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
      Accept: 'application/json',
    },
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
    } catch (error) {
      const errorBody = _.get(error, 'body.error')
      if (errorBody) {
        cli.error(errorBody)
      }

      throw error
    }
  }

  async post(path: string, requestBody: any): Promise<any> {
    try {
      const opts = {
        ...this.options,
        body: requestBody,
      }
      const response = await this.client.post(path, opts)
      return response.body
    } catch (error) {
      const baseErrors = _.get(error, 'body.error.base')
      if (baseErrors) {
        cli.error(baseErrors.join(', '))
      }

      const errorBody = _.get(error, 'body.error')
      if (errorBody) {
        cli.error(errorBody)
      }

      throw error
    }
  }
}
