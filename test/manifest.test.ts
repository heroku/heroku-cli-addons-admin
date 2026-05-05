import {Config} from '@oclif/core'
import {expect} from 'chai'
import {existsSync} from 'node:fs'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'

import type {ManifestInterface} from '../src/manifest.js'

import Addon from '../src/addon.js'
import {ManifestLocal} from '../src/manifest.js'
import {createTestManifest, host, manifest} from './utils/test.js'

describe('ManifestLocal (addon_manifest.json)', () => {
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
    const {cleanup: cleanupFn, testDir} = createTestManifest(manifest, 'addon_manifest.json')
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    nock.cleanAll()
    process.chdir(originalCwd)
    cleanup()
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
    expect(existsSync('addon_manifest.json')).to.eq(true)
    expect(await localManifest.get()).to.deep.equal(writeManifest)
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

describe('ManifestLocal (addon-manifest.json)', () => {
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
    const {cleanup: cleanupFn, testDir} = createTestManifest()
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    nock.cleanAll()
    process.chdir(originalCwd)
    cleanup()
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
    expect(existsSync('addon-manifest.json')).to.eq(true)
    expect(await localManifest.get()).to.deep.equal(writeManifest)
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

describe('ManifestLocal (null)', () => {
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
    // Create temp dir without any manifest file
    const {cleanup: cleanupFn, testDir} = createTestManifest(null)
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    nock.cleanAll()
    process.chdir(originalCwd)
    cleanup()
  })

  it('.get throws error when no manifest exists', async () => {
    const localManifest = new ManifestLocal()
    try {
      await localManifest.get()
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.contain('Check if addon-manifest.json exists')
    }
  })

  it('.get caching', async () => {
    // Write a manifest first so we can test caching
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    await localManifest.set(writeManifest)
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).to.equal(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).to.equal(writeManifest)
    expect(existsSync('addon-manifest.json')).to.eq(true)
    expect(await localManifest.get()).to.deep.equal(writeManifest)
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

const createAddon = () => new Addon({} as Config)

describe('ManifestRemote', () => {
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
    const {cleanup: cleanupFn, testDir} = createTestManifest()
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    nock.cleanAll()
    process.chdir(originalCwd)
    cleanup()
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
