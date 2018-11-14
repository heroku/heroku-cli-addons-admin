import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import {host, manifest as localManifest, test} from '../../../../utils/test'

const manifest = {remote: true, ...localManifest}

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

  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

  pullTest
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .command(['addons:admin:manifest:pull', 'testing-123'])
    .it('writes to the manifest file', () => {
      expect(fsWriteFileSync.called).to.eq(true)
    })
})
