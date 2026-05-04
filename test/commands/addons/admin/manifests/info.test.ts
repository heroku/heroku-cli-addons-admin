import {expect} from 'chai'
import nock from 'nock'
import {stdout} from 'stdout-stderr'

import Cmd from '../../../../../src/commands/addons/admin/manifests/info.js'
import {runCommand} from '../../../../run-command.js'
import {createTestManifest} from '../../../../utils/test.js'

const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

const manifest = {
  contents: {
    foo: 'bar',
  },
  created_at: '2017-07-18T21:47:25.894Z',
  id: '1a2e3c33-c949-4599-97d9-4ed684c35c2f',
}

describe('addons:admin:manifests:info', () => {
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

  it('prints manifest using -m', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/manifests/1a2e3c33-c949-4599-97d9-4ed684c35c2f')
    .reply(200, manifest)

    await runCommand(Cmd, ['-m', '1a2e3c33-c949-4599-97d9-4ed684c35c2f'])

    expect(stdout.output).to.equal(`{
  "foo": "bar"
}
`)
  })

  it('prints manifest using --manifest', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/manifests/1a2e3c33-c949-4599-97d9-4ed684c35c2f')
    .reply(200, manifest)

    await runCommand(Cmd, ['--manifest', '1a2e3c33-c949-4599-97d9-4ed684c35c2f'])

    expect(stdout.output).to.equal(`{
  "foo": "bar"
}
`)
  })

  it('takes an optional add-on slug argument', async () => {
    nock(host)
    .get('/api/v3/addons/arg-slug/manifests/1a2e3c33-c949-4599-97d9-4ed684c35c2f')
    .reply(200, manifest)

    await runCommand(Cmd, ['arg-slug', '-m', '1a2e3c33-c949-4599-97d9-4ed684c35c2f'])

    expect(stdout.output).to.equal(`{
  "foo": "bar"
}
`)
  })
})
