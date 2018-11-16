import {IConfig} from '@oclif/config'
import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import Addon from '../src/addon'
import {ManifestInterface, ManifestLocal} from '../src/manifest'

import {host, manifest, test} from './utils/test'

describe('ManifestLocal', () => {
  test
    .it('.get', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.get()).to.be.a('object')
      expect(await localManifest.get()).to.deep.equal(manifest)
    })
  test
    .it('.get caching', async () => {
      const localManifest = new ManifestLocal()
      const manifestGet = await localManifest.get()
      expect(await localManifest.get()).to.equal(manifestGet)
    })

  const writeManifest = {id: 'slug'} as ManifestInterface

  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)

  test
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .it('.set', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
      expect(fsWriteFileSync.called).to.eq(true)
      expect(await localManifest.get()).to.equal(writeManifest)
    })

  test
    .stdout()
    .it('.log', async ctx => {
      const localManifest = new ManifestLocal()
      await localManifest.set(manifest)
      expect(await localManifest.log()).to.be.a('undefined')
      expect(ctx.stdout).to.deep.equal(`{
 "id": "testing-123",
 "name": "MyAddon",
 "api": {
  "config_vars_prefix": "MYADDON",
  "config_vars": [
   "MYADDON_URL"
  ],
  "password": "bv95AM7726CwVQ7cHUSKuOb3tTREDdVn",
  "sso_salt": "KtdFl80yzJvkEvq7bmJuQkuXKtV2nx6T",
  "regions": [
   "us",
   "eu"
  ],
  "requires": [],
  "production": {
   "base_url": "https://myaddon.com/heroku/resources",
   "sso_url": "https://myaddon.com/sso/login"
  },
  "test": {
   "base_url": "http://localhost:4567/heroku/resources",
   "sso_url": "http://localhost:4567/sso/login"
  },
  "version": "3"
 }
}
`)
    })
})

const addon = () => {
  return new Addon({} as IConfig)
}

describe('ManifestRemote', () => {
  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: {id: 'testing-123'}})
    )
    .it('.get() returns the manifest contents', async () => {
      expect(await addon().remote().get()).to.deep.equal({id: 'testing-123'})
    })

  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(401, {
        error: 'Forbidden',
      }))
    .do(async () => {
      await addon().remote().get()
    })
    .catch(err => { expect(err.message).to.eq('Forbidden') })
    .it('get() throws an error')

  test
    .nock(host, (api: any) => api
      .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
      .reply(422, {
        error: {
          base: [
            'A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest',
            'Something else failed'
          ]
        }
      })
    )
    .do(async () => {
      await addon().remote().set({id: 'testing-123'} as ManifestInterface)
    })
    .catch(err => {
      expect(err.message).to.eq('A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest, Something else failed')
    })
    .it('.set() throws an error when 422')

  test
    .nock(host, (api: any) => api
      .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
      .reply(401, {
        error: 'Forbidden',
      })
    )
    .do(async () => {
      await addon().remote().set({id: 'testing-123'} as ManifestInterface)
    })
    .catch(err => { expect(err.message).to.eq('Forbidden') })
    .it('set() throws an error when 401')

  test
    .nock(host, (api: any) => api
      .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
      .reply(200, {contents: {id: 'testing-123', $base: 1234}})
    )
    .it('set() pushes the manifest contents', async () => {
      const remoteManifest = addon().remote()
      const manifest = await remoteManifest.set({id: 'testing-123'} as ManifestInterface)
      expect(manifest).to.deep.equal({id: 'testing-123', $base: 1234})
      expect(await remoteManifest.get()).to.deep.equal({id: 'testing-123', $base: 1234})
    })
})
