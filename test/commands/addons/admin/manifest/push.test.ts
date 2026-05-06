import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import nock from 'nock'

import Cmd from '../../../../../src/commands/addons/admin/manifest/push.js'
import {
  createTestManifest, host, manifest as localManifest,
} from '../../../../utils/test.js'

const manifest = {remote: true, ...localManifest}

describe('addons:admin:manifest:push', () => {
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

  it('stdout contains manifest elements', async () => {
    nock(host)
    .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
    .reply(200, {contents: manifest})

    const {stdout} = await runCommand(Cmd, [])

    Object.keys(manifest).forEach(key => {
      if (key !== 'api' && typeof manifest[key] === 'string') {
        expect(stdout).to.contain(manifest[key])
      }
    })
  })

  it('error testing', async () => {
    nock(host)
    .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
    .replyWithError('400')

    const {error} = await runCommand(Cmd, [])
    expect(error).to.be.an('error')
  })

  it('writes to the manifest file', async () => {
    nock(host)
    .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
    .reply(200, {contents: manifest})

    await runCommand(Cmd, [])

    const written = JSON.parse(readFileSync(join(process.cwd(), 'addon-manifest.json'), 'utf8'))
    expect(written).to.deep.equal(manifest)
  })
})
