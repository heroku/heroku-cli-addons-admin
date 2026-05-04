import {Config} from '@oclif/core'
import {expect} from 'chai'
import * as fs from 'fs-extra'
import nock from 'nock'
import * as sinon from 'sinon'
import {stderr, stdout} from 'stdout-stderr'

import type {ManifestInterface} from '../src/manifest.js'

import Addon from '../src/addon.js'
import {ManifestLocal} from '../src/manifest.js'
import {host, manifest} from './utils/test.js'

// TODO: ESM Compatibility - These tests need refactoring for ESM
// Sinon cannot stub ES modules. These tests should be refactored to use real files
// (similar to addon.test.ts) or use import mocking strategies compatible with ESM.
// See: https://github.com/sinonjs/sinon/issues/2377
describe.skip('ManifestLocal (addon_manifest.json)', () => {
  let underExists: sinon.SinonStub
  let fsWriteFileSync: sinon.SinonStub
  let fsReadFileSync: sinon.SinonStub

  beforeEach(() => {
    underExists = sinon.stub(fs, 'existsSync')
    underExists.withArgs('addon-manifest.json').returns(false)
    underExists.withArgs('addon_manifest.json').returns(true)

    const writeManifest = {id: 'slug'} as ManifestInterface
    fsWriteFileSync = sinon.stub(fs, 'writeFileSync')
    fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)
    fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

    fsReadFileSync = sinon.stub(fs, 'readFileSync')
    fsReadFileSync.withArgs('addon_manifest.json').returns(JSON.stringify(manifest))
  })

  afterEach(() => {
    sinon.restore()
    nock.cleanAll()
  })

  it('.get', async () => {
    stderr.start()
    stdout.start()
    const localManifest = new ManifestLocal()
    expect(await localManifest.get()).to.be.a('object')
    expect(await localManifest.get()).to.deep.equal(manifest)
    stderr.stop()
    stdout.stop()
    expect(stderr.output).to.contain('Using addon_manifest.json was a bug')
  })

  it('.get caching', async () => {
    const localManifest = new ManifestLocal()
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).to.equal(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
    expect(fsWriteFileSync.called).to.eq(true)
    expect(await localManifest.get()).to.equal(writeManifest)
  })

  it('.log', async () => {
    stderr.start()
    stdout.start()
    const localManifest = new ManifestLocal()
    await localManifest.set(manifest)
    expect(await localManifest.log()).to.be.a('undefined')
    stderr.stop()
    stdout.stop()
    expect(stdout.output).to.deep.equal(`{
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

  it('.filename', async () => {
    expect(new ManifestLocal().filename()).to.eq('addon_manifest.json')
  })
})

// TODO: ESM Compatibility - These tests need refactoring for ESM
// Sinon cannot stub ES modules. These tests should be refactored to use real files
// (similar to addon.test.ts) or use import mocking strategies compatible with ESM.
// See: https://github.com/sinonjs/sinon/issues/2377
describe.skip('ManifestLocal (addon-manifest.json)', () => {
  let dashExists: sinon.SinonStub
  let fsWriteFileSync: sinon.SinonStub
  let fsReadFileSync: sinon.SinonStub

  beforeEach(() => {
    dashExists = sinon.stub(fs, 'existsSync')
    dashExists.withArgs('addon_manifest.json').returns(false)
    dashExists.withArgs('addon-manifest.json').returns(true)

    const writeManifest = {id: 'slug'} as ManifestInterface
    fsWriteFileSync = sinon.stub(fs, 'writeFileSync')
    fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)
    fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

    fsReadFileSync = sinon.stub(fs, 'readFileSync')
    fsReadFileSync.withArgs('addon-manifest.json').returns(JSON.stringify(manifest))
  })

  afterEach(() => {
    sinon.restore()
    nock.cleanAll()
  })

  it('.get', async () => {
    const localManifest = new ManifestLocal()
    expect(await localManifest.get()).to.be.a('object')
    expect(await localManifest.get()).to.deep.equal(manifest)
  })

  it('.get caching', async () => {
    const localManifest = new ManifestLocal()
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).to.equal(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
    expect(fsWriteFileSync.called).to.eq(true)
    expect(await localManifest.get()).to.equal(writeManifest)
  })

  it('.log', async () => {
    stderr.start()
    stdout.start()
    const localManifest = new ManifestLocal()
    await localManifest.set(manifest)
    expect(await localManifest.log()).to.be.a('undefined')
    stderr.stop()
    stdout.stop()
    expect(stdout.output).to.deep.equal(`{
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

  it('.filename', async () => {
    expect(new ManifestLocal().filename()).to.eq('addon-manifest.json')
  })
})

// TODO: ESM Compatibility - These tests need refactoring for ESM
// Sinon cannot stub ES modules. These tests should be refactored to use real files
// (similar to addon.test.ts) or use import mocking strategies compatible with ESM.
// See: https://github.com/sinonjs/sinon/issues/2377
describe.skip('ManifestLocal (null)', () => {
  let noneExist: sinon.SinonStub
  let fsWriteFileSync: sinon.SinonStub
  let fsReadFileSync: sinon.SinonStub

  beforeEach(() => {
    noneExist = sinon.stub(fs, 'existsSync')
    noneExist.withArgs('addon_manifest.json').returns(false)
    noneExist.withArgs('addon-manifest.json').returns(false)

    const writeManifest = {id: 'slug'} as ManifestInterface
    fsWriteFileSync = sinon.stub(fs, 'writeFileSync')
    fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(writeManifest, null, 2)).returns(undefined)
    fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

    fsReadFileSync = sinon.stub(fs, 'readFileSync')
    fsReadFileSync.withArgs('addon-manifest.json').returns(JSON.stringify(manifest))
  })

  afterEach(() => {
    sinon.restore()
    nock.cleanAll()
  })

  it('.get', async () => {
    const localManifest = new ManifestLocal()
    expect(await localManifest.get()).to.be.a('object')
    expect(await localManifest.get()).to.deep.equal(manifest)
  })

  it('.get caching', async () => {
    const localManifest = new ManifestLocal()
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).to.equal(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
    expect(fsWriteFileSync.called).to.eq(true)
    expect(await localManifest.get()).to.equal(writeManifest)
  })

  it('.log', async () => {
    stderr.start()
    stdout.start()
    const localManifest = new ManifestLocal()
    await localManifest.set(manifest)
    expect(await localManifest.log()).to.be.a('undefined')
    stderr.stop()
    stdout.stop()
    expect(stdout.output).to.deep.equal(`{
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

  it('.filename', async () => {
    expect(new ManifestLocal().filename()).to.eq('addon-manifest.json')
  })
})

// TODO: ESM Compatibility - These tests need refactoring for ESM
// Sinon cannot stub ES modules. These tests should be refactored to use real files
// (similar to addon.test.ts) or use import mocking strategies compatible with ESM.
// See: https://github.com/sinonjs/sinon/issues/2377
const createAddon = () => new Addon({} as Config)

describe.skip('ManifestRemote', () => {
  let fsReadFileSync: sinon.SinonStub

  beforeEach(() => {
    fsReadFileSync = sinon.stub(fs, 'readFileSync')
    fsReadFileSync.withArgs('addon-manifest.json').returns(JSON.stringify(manifest))
  })

  afterEach(() => {
    sinon.restore()
    nock.cleanAll()
  })

  it('.get() returns the manifest contents', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .reply(200, {contents: {id: 'testing-123'}})

    expect(await createAddon().remote().get()).to.deep.equal({id: 'testing-123'})
  })

  it('get() throws an error', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .reply(401, {
      error: 'Forbidden',
    })

    try {
      await createAddon().remote().get()
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.eq('Forbidden')
    }
  })

  it('.set() throws an error when 422', async () => {
    nock(host)
    .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
    .reply(422, {
      error: {
        base: [
          'A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest',
          'Something else failed',
        ],
      },
    })

    try {
      await createAddon().remote().set({id: 'testing-123'} as ManifestInterface)
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.eq('A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest, Something else failed')
    }
  })

  it('set() throws an error when 401', async () => {
    nock(host)
    .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
    .reply(401, {
      error: 'Forbidden',
    })

    try {
      await createAddon().remote().set({id: 'testing-123'} as ManifestInterface)
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.eq('Forbidden')
    }
  })

  it('set() pushes the manifest contents', async () => {
    nock(host)
    .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
    .reply(200, {contents: {$base: 1234, id: 'testing-123'}})

    const remoteManifest = createAddon().remote()
    const result = await remoteManifest.set({id: 'testing-123'} as ManifestInterface)
    expect(result).to.deep.equal({$base: 1234, id: 'testing-123'})
    expect(await remoteManifest.get()).to.deep.equal({$base: 1234, id: 'testing-123'})
  })
})
