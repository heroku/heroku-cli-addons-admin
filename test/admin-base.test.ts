import {Config} from '@oclif/config'
import {expect} from '@oclif/test'
import * as path from 'path'

import AdminBase from '../src/admin-base'

import {host, test} from './utils/test'

const root = path.resolve(__dirname, '../package.json')
const config = new Config({root})
class Test extends AdminBase {
  async run() {}
}
const cmd = new Test([], config)

describe('AdminBase', () => {
  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/slug/current_manifest')
      .reply(200, {contents: {id: 'slug'}})
    )
    .it('returns the manifest contents', async () => {
      const manifest: any = await cmd.addons.pull('slug')
      expect(manifest).to.deep.equal({id: 'slug'})
    })

  test
    .nock(host, (api: any) => api
      .post('/api/v3/addons/slug/manifests', {contents: {id: 'slug'}})
      .reply(422, {
        error: {
          base: [
            'A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest',
            'Something else failed'
          ]
        }
      })
    )
    .do(async () => cmd.addons.push({id: 'slug'}))
    .catch(err => {
      expect(err.message).to.eq('A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest, Something else failed')
    })
    .it('throws an error')

  test
    .nock(host, (api: any) => api
      .post('/api/v3/addons/slug/manifests', {contents: {id: 'slug'}})
      .reply(401, {
        error: 'Forbidden',
      })
    )
    .do(async () => cmd.addons.push({id: 'slug'}))
    .catch(err => { expect(err.message).to.eq('Forbidden') })
    .it('throws an error')

  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/slug/current_manifest')
      .reply(401, {
        error: 'Forbidden',
      })
    )
    .do(async () => cmd.addons.pull('slug'))
    .catch(err => { expect(err.message).to.eq('Forbidden') })
    .it('throws an error')

  test
    .nock(host, (api: any) => api
      .post('/api/v3/addons/slug/manifests', {contents: {id: 'slug'}})
      .reply(200, {contents: {id: 'slug', $base: 1234}})
    )
    .it('pushes the manifest contents', async () => {
      const manifest: any = await cmd.addons.push({id: 'slug'})
      expect(manifest).to.deep.equal({id: 'slug', $base: 1234})
    })
})
