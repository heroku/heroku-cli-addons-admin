import {expect} from '@oclif/test'

import {host, manifest, test} from '../../../../utils/test'

describe('addons:admin:manifest:pull', () => {
  const pullTest = test
    .stdout()
    .stderr()
    .nock(host, (api: any) => api
      .get('/api/v3/addons/testing-123/current_manifest')
      .reply(200, {contents: manifest})
    )

  pullTest
    .command(['addons:admin:manifest:pull', 'testing-123'])
    .it('stdout contains manifest elements', (ctx: any) => {
      Object.keys(manifest).forEach(key => {
        if (key !== 'api') expect(ctx.stdout).to.contain(manifest[key])
      })
    })

  pullTest
    .command(['addons:admin:manifest:pull', 'testing-123'])
    .it('pull grabs slug from manifest')

  test
    .stdout()
    .stderr()
    .nock(host, (api: any) => api
      .get('/api/v3/addons/fakeslug/current_manifest')
      .replyWithError(400)
    )
    .command(['addons:admin:manifest:pull', 'fakeslug'])
    .catch(err => {
      expect(err).to.be.an('error')
    })
    .it('errors for fake slugs')
})
