import {captureOutput} from '@heroku-cli/test-utils'
import {Config} from '@oclif/core'
import nock from 'nock'
import {existsSync} from 'node:fs'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

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
    let localManifest: ManifestLocal
    const {stderr} = await captureOutput(async () => {
      localManifest = new ManifestLocal()
      expect(await localManifest!.get()).toBeTypeOf('object')
      expect(await localManifest!.get()).toEqual(manifest)
    })
    expect(stderr).toContain('Using addon_manifest.json was a bug')
  })

  it('.get caching', async () => {
    const localManifest = new ManifestLocal()
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).toBe(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).toBe(writeManifest)
    expect(existsSync('addon_manifest.json')).toBe(true)
    expect(await localManifest.get()).toEqual(writeManifest)
  })

  it('.log', async () => {
    const localManifest = new ManifestLocal()
    await localManifest.set(manifest)
    const {stdout} = await captureOutput(async () => {
      await localManifest.log()
    })
    expect(stdout).toEqual(`{
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
    expect(new ManifestLocal().filename()).toBe('addon_manifest.json')
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
    expect(await localManifest.get()).toBeTypeOf('object')
    expect(await localManifest.get()).toEqual(manifest)
  })

  it('.get caching', async () => {
    const localManifest = new ManifestLocal()
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).toBe(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).toBe(writeManifest)
    expect(existsSync('addon-manifest.json')).toBe(true)
    expect(await localManifest.get()).toEqual(writeManifest)
  })

  it('.log', async () => {
    const localManifest = new ManifestLocal()
    await localManifest.set(manifest)
    const {stdout} = await captureOutput(async () => {
      await localManifest.log()
    })
    expect(stdout).toEqual(`{
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
    expect(new ManifestLocal().filename()).toBe('addon-manifest.json')
  })
})

describe('ManifestLocal (null)', () => {
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
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
    await expect(localManifest.get()).rejects.toThrow(/Check if addon-manifest\.json exists/)
  })

  it('.get caching', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    await localManifest.set(writeManifest)
    const manifestGet = await localManifest.get()
    expect(await localManifest.get()).toBe(manifestGet)
  })

  it('.set', async () => {
    const writeManifest = {id: 'slug'} as ManifestInterface
    const localManifest = new ManifestLocal()
    expect(await localManifest.set(writeManifest)).toBe(writeManifest)
    expect(existsSync('addon-manifest.json')).toBe(true)
    expect(await localManifest.get()).toEqual(writeManifest)
  })

  it('.log', async () => {
    const localManifest = new ManifestLocal()
    await localManifest.set(manifest)
    const {stdout} = await captureOutput(async () => {
      await localManifest.log()
    })
    expect(stdout).toEqual(`{
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
    expect(new ManifestLocal().filename()).toBe('addon-manifest.json')
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

    expect(await createAddon().remote().get()).toEqual({id: 'testing-123'})
  })

  it('get() throws an error', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(401, {
        error: 'Forbidden',
      })

    await expect(createAddon().remote().get()).rejects.toThrow('Forbidden')
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

    await expect(createAddon().remote().set({id: 'testing-123'} as ManifestInterface))
      .rejects.toThrow('A list of supported regions is required, see https://devcenter.heroku.com/articles/add-on-manifest, Something else failed')
  })

  it('set() throws an error when 401', async () => {
    nock(host)
      .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
      .reply(401, {
        error: 'Forbidden',
      })

    await expect(createAddon().remote().set({id: 'testing-123'} as ManifestInterface))
      .rejects.toThrow('Forbidden')
  })

  it('set() pushes the manifest contents', async () => {
    nock(host)
      .post('/api/v3/addons/testing-123/manifests', {contents: {id: 'testing-123'}})
      .reply(200, {contents: {$base: 1234, id: 'testing-123'}})

    const remoteManifest = createAddon().remote()
    const result = await remoteManifest.set({id: 'testing-123'} as ManifestInterface)
    expect(result).toEqual({$base: 1234, id: 'testing-123'})
    expect(await remoteManifest.get()).toEqual({$base: 1234, id: 'testing-123'})
  })
})
