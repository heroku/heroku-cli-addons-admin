import {expect} from 'chai'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import nock from 'nock'
import {stdout} from 'stdout-stderr'

import Cmd from '../../../../../src/commands/addons/admin/manifest/push.js'
import {runCommand} from '../../../../run-command.js'
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

    await runCommand(Cmd)

    Object.keys(manifest).forEach(key => {
      if (key !== 'api') expect(stdout.output).to.contain(manifest[key])
    })
  })

  it('error testing', async () => {
    nock(host)
    .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
    .replyWithError('400')

    try {
      await runCommand(Cmd)
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error).to.be.an('error')
    }
  })

  it('writes to the manifest file', async () => {
    nock(host)
    .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
    .reply(200, {contents: manifest})

    await runCommand(Cmd)

    // Read the file that was written
    const written = JSON.parse(readFileSync(join(process.cwd(), 'addon-manifest.json'), 'utf8'))
    expect(written).to.deep.equal(manifest)
  })
})
