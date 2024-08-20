import {expect} from '@oclif/test'

import test from '../../../../utils/test'

const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

const manifest = {
  id: '1a2e3c33-c949-4599-97d9-4ed684c35c2f',
  created_at: '2017-07-18T21:47:25.894Z',
  contents: {
    foo: 'bar',
  },
}

describe('addons:admin:manifests:info', () => {
  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/manifests/1a2e3c33-c949-4599-97d9-4ed684c35c2f')
      .reply(200, manifest)
    )
    .stdout()
    .command(['addons:admin:manifests:info', '-m', '1a2e3c33-c949-4599-97d9-4ed684c35c2f'])
    .it('prints manifest using -m', ctx => {
      expect(ctx.stdout).to.equal(
      // eslint-disable-next-line indent
`{
  "foo": "bar"
}
`)
    })

  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/manifests/1a2e3c33-c949-4599-97d9-4ed684c35c2f')
      .reply(200, manifest)
    )
    .stdout()
    .command(['addons:admin:manifests:info', '--manifest', '1a2e3c33-c949-4599-97d9-4ed684c35c2f'])
    .it('prints manifest using --manifest', ctx => {
      expect(ctx.stdout).to.equal(
      // eslint-disable-next-line indent
`{
  "foo": "bar"
}
`)
    })

  test
    .nock(host, (api: any) => api
      .get('/api/v3/addons/arg-slug/manifests/1a2e3c33-c949-4599-97d9-4ed684c35c2f')
      .reply(200, manifest)
    )
    .stdout()
    .command(['addons:admin:manifests:info', 'arg-slug', '-m', '1a2e3c33-c949-4599-97d9-4ed684c35c2f'])
    .it('takes an optional add-on slug argument', ctx => {
      expect(ctx.stdout).to.equal(
      // eslint-disable-next-line indent
`{
  "foo": "bar"
}
`)
    })
})
