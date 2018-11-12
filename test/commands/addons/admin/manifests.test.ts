import {expect} from '@oclif/test'

import test from '../../../utils/test'

const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

const manifests = [
  {
    id: '1a2e3c33-c949-4599-97d9-4ed684c35c2f',
    created_at: '2017-07-18T21:47:25.894Z',
    contents: {
      foo: 'bar'
    }
  },
  {
    id: '80d90dfb-049f-436b-9543-24cc7b691352',
    created_at: '2017-07-19T21:47:25.894Z',
    contents: {
      biz: 'baz'
    }
  }
]

describe('addons:admin:manifests', () => {
  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/manifests')
      .reply(200, manifests)
    )
    .stdout()
    .command(['addons:admin:manifests'])
    .it('prints a list of manifests', ctx => {
      expect(ctx.stdout).to.equal(
`Manfiest                              Created At
────────────────────────────────────  ────────────────────────
80d90dfb-049f-436b-9543-24cc7b691352  2017-07-19T21:47:25.894Z
1a2e3c33-c949-4599-97d9-4ed684c35c2f  2017-07-18T21:47:25.894Z
`)
    })

  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/arg-slug/manifests')
      .reply(200, manifests)
    )
    .stdout()
    .command(['addons:admin:manifests', 'arg-slug'])
    .it('prints a list of manifests', ctx => {
      expect(ctx.stdout).to.equal(
`Manfiest                              Created At
────────────────────────────────────  ────────────────────────
80d90dfb-049f-436b-9543-24cc7b691352  2017-07-19T21:47:25.894Z
1a2e3c33-c949-4599-97d9-4ed684c35c2f  2017-07-18T21:47:25.894Z
`)
    })
})
