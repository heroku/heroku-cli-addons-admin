
import {expect} from '@oclif/test'

import {host, manifest, test} from '../../../../utils/test'

// mandatory elements in a single manifest document (refer to /src/utils/manifest.ts)
const manifestElements: string[] = ['id', 'name', 'api']
const manifestAPIElements: string[] = [
  'config_vars_prefix',
  'config_vars',
  'password',
  'sso_salt',
  'regions',
  'requires',
  'production',
  'test',
  'version'
]
const otherElements = ['base_url', 'sso_url']

const testManifest = {
  test: 'testing'
}

describe('addons:admin:manifest:diff', () => {
  test
    .nock(host, (api: any) => api
      .get('/provider/addons/testing-123')
      .reply(200, manifest)
    )
    .stdout()
    .stderr()
    .command(['addons:admin:manifest:diff'])
    .it('contains static stdout', (ctx: any) => {
      expect(ctx.stdout).to.contain('testing-123')
    })

  test
    .nock(host, (api: any) => api
      .get('/provider/addons/testing-123')
      .reply(200, manifest)
    )
    .stdout()
    .stderr()
    .command(['addons:admin:manifest:diff'])
    .it('contains all elements', (ctx: any) => {
      manifestElements.forEach(val => {
        expect(ctx.stdout).to.contain(val)
      })
      manifestAPIElements.forEach(val => {
        expect(ctx.stdout).to.contain(val)
      })
      otherElements.forEach(val => {
        expect(ctx.stdout).to.contain(val)
      })
    })

  test
    .nock(host, (api: any) => {
      api.get('/provider/addons/testing-123')
        .reply(200, {body: testManifest})
    })
    .stdout()
    .stderr()
    .command(['addons:admin:manifest:diff'])
    .it('contains correct test API elements', (ctx: any) => {
      expect(ctx.stdout).to.contain(`"test": "${testManifest.test}"`)
    })

  test
    .nock(host, (api: any) => {
      api.get('/provider/addons/testing-123')
        .replyWithError('test')
    })
    .stdout()
    .stderr()
    .command(['addons:admin:manifest:diff'])
    .catch((err: any) => {
      expect(err).to.be.an('error')
    })
    .it('error testing')
})
