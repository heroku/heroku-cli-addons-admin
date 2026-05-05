
import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

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

    expect(stdout).to.contain('testing-123')
  })

  it('contains all elements', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .reply(200, {contents: manifest})

    const {stdout} = await runCommand(Cmd, [])

    manifestElements.forEach(val => {
      expect(stdout).to.contain(val)
    })
    manifestAPIElements.forEach(val => {
      expect(stdout).to.contain(val)
    })
    otherElements.forEach(val => {
      expect(stdout).to.contain(val)
    })
  })

  it('contains correct test API elements', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .reply(200, {contents: testManifest})

    const {stdout} = await runCommand(Cmd, [])

    expect(stdout).to.contain(`"test": "${testManifest.test}"`)
  })

  it('error testing', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .replyWithError('test')

    const {error} = await runCommand(Cmd, [])
    expect(error).to.be.an('error')
  })
})
