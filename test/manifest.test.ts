import {IConfig} from '@oclif/config'
import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import Addon from '../src/addon'
import {ManifestInterface, ManifestLocal} from '../src/manifest'

import {host, manifest, test} from './utils/test'

const underExists = sinon.stub()
underExists.throws('not stubbed')
underExists.withArgs('addon-manifest.json').returns(false)
underExists.withArgs('addon_manifest.json').returns(true)

describe('ManifestLocal (addon_manifest.json)', () => {
  const writeManifest = {id: 'slug'} as ManifestInterface

  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)
  fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

  const fsReadFileSync = sinon.stub()
  fsReadFileSync.throws('read not stubbed')
  fsReadFileSync.withArgs('addon_manifest.json').returns(JSON.stringify(manifest))

  const underTest = test
    .stub(fs, 'readFileSync', fsReadFileSync)
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .stub(fs, 'existsSync', underExists)
    .stub(fs, 'existsSync', underExists)

  underTest
    .stderr()
    .it('.get', async ctx => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.get()).to.be.a('object')
      expect(await localManifest.get()).to.deep.equal(manifest)
      expect(ctx.stderr).to.contain('Using addon_manifest.json was a bug')
    })

  underTest
    .it('.get caching', async () => {
      const localManifest = new ManifestLocal()
      const manifestGet = await localManifest.get()
      expect(await localManifest.get()).to.equal(manifestGet)
    })

  underTest
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .it('.set', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
      expect(fsWriteFileSync.called).to.eq(true)
      expect(await localManifest.get()).to.equal(writeManifest)
    })

  underTest
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

  underTest
    .it('.filename', async () => {
      expect(new ManifestLocal().filename()).to.eq('addon_manifest.json')
    })
})

const dashExists = sinon.stub()
dashExists.throws('not stubbed')
dashExists.withArgs('addon_manifest.json').returns(false)
dashExists.withArgs('addon-manifest.json').returns(true)

describe('ManifestLocal (addon-manifest.json)', () => {
  const dashTest = test
    .stub(fs, 'existsSync', dashExists)

  dashTest
    .it('.get', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.get()).to.be.a('object')
      expect(await localManifest.get()).to.deep.equal(manifest)
    })
  dashTest
    .it('.get caching', async () => {
      const localManifest = new ManifestLocal()
      const manifestGet = await localManifest.get()
      expect(await localManifest.get()).to.equal(manifestGet)
    })

  const writeManifest = {id: 'slug'} as ManifestInterface

  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)

  dashTest
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .it('.set', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
      expect(fsWriteFileSync.called).to.eq(true)
      expect(await localManifest.get()).to.equal(writeManifest)
    })

  dashTest
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

  dashTest
    .it('.filename', async () => {
      expect(new ManifestLocal().filename()).to.eq('addon-manifest.json')
    })
})

const noneExist = sinon.stub()
noneExist.throws('not stubbed')
noneExist.withArgs('addon_manifest.json').returns(false)
noneExist.withArgs('addon-manifest.json').returns(false)

describe('ManifestLocal (null)', () => {
  const noneTest = test
    .stub(fs, 'existsSync', dashExists)

  noneTest
    .it('.get', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.get()).to.be.a('object')
      expect(await localManifest.get()).to.deep.equal(manifest)
    })

  noneTest
    .it('.get caching', async () => {
      const localManifest = new ManifestLocal()
      const manifestGet = await localManifest.get()
      expect(await localManifest.get()).to.equal(manifestGet)
    })

  const writeManifest = {id: 'slug'} as ManifestInterface

  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)

  noneTest
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .it('.set', async () => {
      const localManifest = new ManifestLocal()
      expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
      expect(fsWriteFileSync.called).to.eq(true)
      expect(await localManifest.get()).to.equal(writeManifest)
    })

  noneTest
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

  noneTest
    .it('.filename', async () => {
      expect(new ManifestLocal().filename()).to.eq('addon-manifest.json')
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
