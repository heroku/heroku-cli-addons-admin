import {runCommand} from '@heroku-cli/test-utils'
import nock from 'nock'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import Cmd from '../../../../../src/commands/addons/admin/manifest/pull.js'
import {
  createTestManifest, host, manifest as localManifest,
} from '../../../../utils/test.js'

const manifest = {remote: true, ...localManifest}

describe('addons:admin:manifest:pull', () => {
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
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: manifest})

    const {stdout} = await runCommand(Cmd, ['testing-123'])

    for (const key of Object.keys(manifest)) {
      if (key !== 'api' && typeof manifest[key] === 'string') {
        expect(stdout).toContain(manifest[key])
      }
    }
  })

  it('pull grabs slug from manifest', async () => {
    const scope = nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: manifest})

    await runCommand(Cmd, ['testing-123'])

    expect(scope.isDone()).toBe(true)
  })

  it('errors for fake slugs', async () => {
    nock(host)
      .get('/api/v3/addons/fakeslug/current_manifest')
      .replyWithError('400')

    const {error} = await runCommand(Cmd, ['fakeslug'])
    expect(error).toBeInstanceOf(Error)
  })

  it('writes to the manifest file', async () => {
    nock(host)
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: manifest})

    await runCommand(Cmd, ['testing-123'])

    const written = JSON.parse(readFileSync(join(process.cwd(), 'addon-manifest.json'), 'utf8'))
    expect(written).toEqual(manifest)
  })
})
