import {APIClient} from '@heroku-cli/command'
import {ux} from '@oclif/core'
import * as url from 'url'
import {HTTPError} from '@heroku/http-call'

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
    const herokuHost = process.env.HEROKU_HOST || 'heroku.com'
    client.defaults.host = host ? url.parse(host).host : `addons.${herokuHost}`

    this.client = client
  }

  async get(path: string): Promise<any> {
    const response = await this.client.get(path, this.options).catch((error: HTTPError) => {
      const errorBody = error?.body?.error
      if (errorBody) {
        ux.error(errorBody)
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
        ux.error(baseErrors.join(', '))
      }

      const errorBody = error?.body?.error
      if (errorBody) {
        ux.error(errorBody)
      }

      throw error
    })
    return response.body
  }
}
