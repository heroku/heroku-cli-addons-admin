import {Config} from '@oclif/core'
import nock from 'nock'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import Addon from '../src/addon.js'
import {createTestManifest, host} from './utils/test.js'

const addon = (slug?: string) => new Addon({} as Config, slug)

describe('Addon', () => {
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

  it('.slug returns the filesystem slug when no arg', async () => {
    expect(await addon().slug()).toBe('testing-123')
  })

  it('.slug returns the arg slug when provided', async () => {
    expect(await addon('arg').slug()).toBe('arg')
  })

  it('.slug throws error when no slug', async () => {
    const {cleanup: emptyCleanup, testDir: emptyTestDir} = createTestManifest({})
    process.chdir(emptyTestDir)

    try {
      await expect(addon().slug()).rejects.toThrow('No slug found in manifest')
    } finally {
      process.chdir(originalCwd)
      emptyCleanup()
    }
  })

  it('manifests() throws an error', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/manifests')
      .reply(401, {
        error: 'Forbidden',
      })

    await expect(addon().manifests()).rejects.toThrow('Forbidden')
  })

  it('manifest() throws an error', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/manifests/uuid')
      .reply(401, {
        error: 'Forbidden',
      })

    await expect(addon().manifest('uuid')).rejects.toThrow('Forbidden')
  })
})
