import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../../src/commands/addons/admin/manifests.js'
import {createTestManifest} from '../../../utils/test.js'

const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

const removeAllWhitespace = (str: string) => str.replaceAll(/\s/g, '')

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

  it('prints a list of manifests', async () => {
    nock(host)
    .get('/api/v3/addons/testing-123/manifests')
    .reply(200, manifests)

    const {stdout} = await runCommand(Cmd, [])

    const actual = removeAllWhitespace(stdout)
    const expected = removeAllWhitespace(
      '80d90dfb-049f-436b-9543-24cc7b691352 2017-07-19T21:47:25.894Z\n'
      + '1a2e3c33-c949-4599-97d9-4ed684c35c2f 2017-07-18T21:47:25.894Z\n',
    )
    expect(actual).to.include(removeAllWhitespace('Manifest'))
    expect(actual).to.include(removeAllWhitespace('CreatedAt'))
    expect(actual).to.include(expected)
  })

  it('prints a list of manifests with arg-slug', async () => {
    nock(host)
    .get('/api/v3/addons/arg-slug/manifests')
    .reply(200, manifests)

    const {stdout} = await runCommand(Cmd, ['arg-slug'])

    const actual = removeAllWhitespace(stdout)
    const expected = removeAllWhitespace(
      '80d90dfb-049f-436b-9543-24cc7b691352 2017-07-19T21:47:25.894Z\n'
      + '1a2e3c33-c949-4599-97d9-4ed684c35c2f 2017-07-18T21:47:25.894Z\n',
    )
    expect(actual).to.include(removeAllWhitespace('Manifest'))
    expect(actual).to.include(removeAllWhitespace('CreatedAt'))
    expect(actual).to.include(expected)
  })
})
