import {runCommand} from '@heroku-cli/test-utils'
import nock from 'nock'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import Cmd from '../../../../../src/commands/addons/admin/manifest/diff.js'
import {
  createTestManifest, host, manifest,
} from '../../../../utils/test.js'

// mandatory elements in a single manifest document (refer to /src/utils/manifest.ts)
const manifestElements: string[] = ['id', 'name', 'api']
const manifestAPIElements: string[] = [
  'config_vars_prefix',
  'config_vars',
  'password',
  'sso_salt',
  'regions',
  'requires',
  'production',
  'test',
  'version',
]
const otherElements = ['base_url', 'sso_url']

const testManifest = {
  test: 'testing',
}

describe('addons:admin:manifest:diff', () => {
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

  it('contains static stdout', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: manifest})

    const {stdout} = await runCommand(Cmd, [])

    expect(stdout).toContain('testing-123')
  })

  it('contains all elements', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: manifest})

    const {stdout} = await runCommand(Cmd, [])

    for (const val of manifestElements) {
      expect(stdout).toContain(val)
    }

    for (const val of manifestAPIElements) {
      expect(stdout).toContain(val)
    }

    for (const val of otherElements) {
      expect(stdout).toContain(val)
    }
  })

  it('contains correct test API elements', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: testManifest})

    const {stdout} = await runCommand(Cmd, [])

    expect(stdout).toContain(`"test": "${testManifest.test}"`)
  })

  it('error testing', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .replyWithError('test')

    const {error} = await runCommand(Cmd, [])
    expect(error).toBeInstanceOf(Error)
  })
})
