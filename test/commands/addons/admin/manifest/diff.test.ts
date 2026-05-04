
import {expect} from 'chai'
import nock from 'nock'
import {stdout} from 'stdout-stderr'

import Cmd from '../../../../../src/commands/addons/admin/manifest/diff.js'
import {runCommand} from '../../../../run-command.js'
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

    await runCommand(Cmd)

    expect(stdout.output).to.contain('testing-123')
  })

  it('contains all elements', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .reply(200, {contents: manifest})

    await runCommand(Cmd)

    manifestElements.forEach(val => {
      expect(stdout.output).to.contain(val)
    })
    manifestAPIElements.forEach(val => {
      expect(stdout.output).to.contain(val)
    })
    otherElements.forEach(val => {
      expect(stdout.output).to.contain(val)
    })
  })

  it('contains correct test API elements', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .reply(200, {contents: testManifest})

    await runCommand(Cmd)

    expect(stdout.output).to.contain(`"test": "${testManifest.test}"`)
  })

  it('error testing', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/current_manifest')
    .replyWithError('test')

    try {
      await runCommand(Cmd)
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error).to.be.an('error')
    }
  })
})
