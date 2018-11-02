import {expect} from '@oclif/test'
import * as fs from 'fs-extra'

import test from '../../../../utils/test'

// test addon
const manifest = require('./../../../../fixture/addon_manifest')

// host for API isolation test
const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com'

describe('addons:admin:manifest:pull', () => {
  const pullTest = test
    .stdout()
    .stderr()
    .stub(fs, 'readFileSync', () => JSON.stringify(manifest))
    .nock(host, (api: any) => api
      .get('/provider/addons/testing-123')
      .reply(200, manifest)
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
      .get('/provider/addons/fakeslug')
      .replyWithError(400)
    )
    .command(['addons:admin:manifest:pull', 'fakeslug'])
    .catch(err => {
      expect(err).to.be.an('error')
    })
    .it('errors for fake slugs')
})
