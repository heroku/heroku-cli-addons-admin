import {APIClient} from '@heroku-cli/command'
import cli from 'cli-ux'
import * as url from 'url'
import {HTTPError} from 'http-call'

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
    const response = await this.client.get(path, this.options).catch((error: HTTPError) => {
      const errorBody = error?.body?.error
      if (errorBody) {
        cli.error(errorBody)
      }

      throw error
    })
    return response.body
  }

  async post(path: string, requestBody: unknown): Promise<any> {
    const opts = {
      ...this.options,
      body: requestBody,
    }
    const response = await this.client.post(path, opts).catch((error: HTTPError) => {
      const baseErrors = error?.body?.error?.base
      if (baseErrors) {
        cli.error(baseErrors.join(', '))
      }

      const errorBody = error?.body?.error
      if (errorBody) {
        cli.error(errorBody)
      }

      throw error
    })
    return response.body
  }
}
