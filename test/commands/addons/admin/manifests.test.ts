import {expect} from 'chai'
import nock from 'nock'
import {stdout} from 'stdout-stderr'

import Cmd from '../../../../src/commands/addons/admin/manifests.js'
import {runCommand} from '../../../run-command.js'
import {createTestManifest} from '../../../utils/test.js'

const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

const manifests = [
  {
    contents: {
      foo: 'bar',
    },
    created_at: '2017-07-18T21:47:25.894Z',
    id: '1a2e3c33-c949-4599-97d9-4ed684c35c2f',
  },
  {
    contents: {
      biz: 'baz',
    },
    created_at: '2017-07-19T21:47:25.894Z',
    id: '80d90dfb-049f-436b-9543-24cc7b691352',
  },
]

describe('addons:admin:manifests', () => {
  let originalCwd: string
  let cleanup: () => void
  let originalEnv: string | undefined

  beforeEach(() => {
    const {cleanup: cleanupFn, testDir} = createTestManifest()
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
    // Force @oclif/table to use fancy renderer which uses stdout.write instead of console.log
    originalEnv = process.env.OCLIF_TABLE_SKIP_CI_CHECK
    process.env.OCLIF_TABLE_SKIP_CI_CHECK = '1'
  })

  afterEach(() => {
    nock.cleanAll()
    process.chdir(originalCwd)
    cleanup()
    if (originalEnv === undefined) {
      delete process.env.OCLIF_TABLE_SKIP_CI_CHECK
    } else {
      process.env.OCLIF_TABLE_SKIP_CI_CHECK = originalEnv
    }
  })

  it('prints a list of manifests', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/manifests')
    .reply(200, manifests)

    await runCommand(Cmd)

    const expected = [
      '┌──────────────────────────────────────┬──────────────────────────┐',
      '│ Manifest                             │ Created At               │',
      '├──────────────────────────────────────┼──────────────────────────┤',
      '│ 80d90dfb-049f-436b-9543-24cc7b691352 │ 2017-07-19T21:47:25.894Z │',
      '├──────────────────────────────────────┼──────────────────────────┤',
      '│ 1a2e3c33-c949-4599-97d9-4ed684c35c2f │ 2017-07-18T21:47:25.894Z │',
      '└──────────────────────────────────────┴──────────────────────────┘',
    ].join('\n')
    expect(stdout.output.trim()).to.eq(expected)
  })

  it('prints a list of manifests with arg-slug', async () => {
    nock(host)
    .get('/api/v3/addons/arg-slug/manifests')
    .reply(200, manifests)

    await runCommand(Cmd, ['arg-slug'])

    const expected = [
      '┌──────────────────────────────────────┬──────────────────────────┐',
      '│ Manifest                             │ Created At               │',
      '├──────────────────────────────────────┼──────────────────────────┤',
      '│ 80d90dfb-049f-436b-9543-24cc7b691352 │ 2017-07-19T21:47:25.894Z │',
      '├──────────────────────────────────────┼──────────────────────────┤',
      '│ 1a2e3c33-c949-4599-97d9-4ed684c35c2f │ 2017-07-18T21:47:25.894Z │',
      '└──────────────────────────────────────┴──────────────────────────┘',
    ].join('\n')
    expect(stdout.output.trim()).to.eq(expected)
  })
})
