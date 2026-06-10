import {runCommand} from '@heroku-cli/test-utils'
import nock from 'nock'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

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

    for (const key of Object.keys(manifest)) {
      if (key !== 'api' && typeof manifest[key] === 'string') {
        expect(stdout).toContain(manifest[key])
      }
    }
  })

  it('error testing', async () => {
    nock(host)
      .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
      .replyWithError('400')

    const {error} = await runCommand(Cmd, [])
    expect(error).toBeInstanceOf(Error)
  })

  it('writes to the manifest file', async () => {
    nock(host)
      .post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
      .reply(200, {contents: manifest})

    await runCommand(Cmd, [])

    const written = JSON.parse(readFileSync(join(process.cwd(), 'addon-manifest.json'), 'utf8'))
    expect(written).toEqual(manifest)
  })
})
