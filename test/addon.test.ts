import {IConfig} from '@oclif/config'
import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import Addon from '../src/addon'

import {host, test} from './utils/test'

const manifestMissingSlug = sinon.stub()
manifestMissingSlug.withArgs('addon-manifest.json').returns(JSON.stringify({}))

const addon = (slug?: string) => {
  return new Addon({} as IConfig, slug)
}

describe('Addon', () => {
  test
    .it('.slug returns the filesystem slug when no arg', async () => {
      expect(await addon().slug()).to.eq('testing-123')
    })
  test
    .it('.slug returns the filesystem slug when no arg', async () => {
      expect(await addon('arg').slug()).to.eq('arg')
    })
  test
    .stub(fs, 'readFileSync', manifestMissingSlug)
    .do(async () => {
      await addon().slug()
    })
    .catch(err => {
      expect(err.message).to.eq('No slug found in manifest')
    })
    .it('.slug throws error when no slug')
  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/manifests')
      .reply(401, {
        error: 'Forbidden',
      })
    )
    .do(async () => {
      await addon().manifests()
    })
    .catch(err => { expect(err.message).to.eq('Forbidden') })
    .it('manifests() throws an error')
  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/manifests/uuid')
      .reply(401, {
        error: 'Forbidden',
      })
    )
    .do(async () => {
      await addon().manifest('uuid')
    })
    .catch(err => { expect(err.message).to.eq('Forbidden') })
    .it('manifest() throws an error')
})
