import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import {host, manifest as localManifest, test} from '../../../../utils/test'

const manifest = {remote: true, ...localManifest}

describe('addons:admin:manifest:push', () => {
  const pushTest = test
    .stdout()
    .stderr()
    .nock(host, (api: any) => {
      api.post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
        .reply(200, {contents: manifest})
    })

  pushTest
    .command(['addons:admin:manifest:push'])
    .it('stdout contains manifest elements', (ctx: any) => {
      Object.keys(manifest).forEach(key => {
        if (key !== 'api') expect(ctx.stdout).to.contain(manifest[key])
      })
    })

  test
    .nock(host, (api: any) => {
      api.post(`/api/v3/addons/${manifest.id}/manifests`, {contents: localManifest})
        .replyWithError(400)
    })
    .stdout()
    .stderr()
    .command(['addons:admin:manifest:push'])
    .catch((err: any) => {
      expect(err).to.be.an('error')
    })
    .it('error testing')

  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon_manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

  pushTest
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .command(['addons:admin:manifest:push'])
    .it('writes to the manifest file', () => {
      expect(fsWriteFileSync.called).to.eq(true)
    })
})
