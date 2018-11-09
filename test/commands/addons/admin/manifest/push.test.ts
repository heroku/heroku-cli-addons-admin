import {expect} from '@oclif/test'

import {host, manifest, test} from '../../../../utils/test'

describe('addons:admin:manifest:push', () => {
  test
    .stdout()
    .stderr()
    .nock(host, (api: any) => {
      api.post('/provider/addons', manifest)
        .reply(200, manifest)
    })
    .command(['addons:admin:manifest:push'])
    .it('stdout contains manifest elements', (ctx: any) => {
      Object.keys(manifest).forEach(key => {
        if (key !== 'api') expect(ctx.stdout).to.contain(manifest[key])
      })
    })

  test
    .nock(host, (api: any) => {
      api.post('/provider/addons', manifest)
        .replyWithError(400)
    })
    .stdout()
    .stderr()
    .command(['addons:admin:manifest:push'])
    .catch((err: any) => {
      expect(err).to.be.an('error')
    })
    .it('error testing')
})
