import {runCommand} from '@heroku-cli/test-utils'
import * as sinon from 'sinon'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import Cmd from '../../../../src/commands/addons/admin/open.js'
import {createTestManifest} from '../../../utils/test.js'

describe('addons:admin:open', () => {
  let urlOpenerStub: sinon.SinonStub
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
    const {cleanup: cleanupFn, testDir} = createTestManifest()
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    sinon.restore()
    process.chdir(originalCwd)
    cleanup()
  })

  it('opens slug in args', async () => {
    urlOpenerStub = sinon.stub(Cmd, 'urlOpener')
    urlOpenerStub.resolves()

    await runCommand(Cmd, ['arg-slug'])

    expect(urlOpenerStub.calledOnce).toBe(true)
    expect(urlOpenerStub.firstCall.args[0]).toBe('https://addons-next.heroku.com/addons/arg-slug')
  })

  it('opens slug from manifest', async () => {
    urlOpenerStub = sinon.stub(Cmd, 'urlOpener')
    urlOpenerStub.resolves()

    await runCommand(Cmd, [])

    expect(urlOpenerStub.calledOnce).toBe(true)
    expect(urlOpenerStub.firstCall.args[0]).toBe('https://addons-next.heroku.com/addons/testing-123')
  })
})
