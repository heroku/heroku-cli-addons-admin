import {Config} from '@oclif/core'
import {expect} from 'chai'
import nock from 'nock'

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
    expect(await addon().slug()).to.eq('testing-123')
  })

  it('.slug returns the arg slug when provided', async () => {
    expect(await addon('arg').slug()).to.eq('arg')
  })

  it('.slug throws error when no slug', async () => {
    // Create a test manifest without an id field
    const {cleanup: emptyCleanup, testDir: emptyTestDir} = createTestManifest({})
    process.chdir(emptyTestDir)

    try {
      await addon().slug()
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.eq('No slug found in manifest')
    } finally {
      process.chdir(originalCwd)
      emptyCleanup()
      process.chdir(originalCwd)
    }
  })

  it('manifests() throws an error', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/manifests')
    .reply(401, {
      error: 'Forbidden',
    })

    try {
      await addon().manifests()
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.eq('Forbidden')
    }
  })

  it('manifest() throws an error', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/manifests/uuid')
    .reply(401, {
      error: 'Forbidden',
    })

    try {
      await addon().manifest('uuid')
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).to.eq('Forbidden')
    }
  })
})
