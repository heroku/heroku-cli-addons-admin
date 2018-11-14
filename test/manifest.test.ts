import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import {LogManifest, ReadManifest, WriteManifest} from '../src/manifest'

import {manifest, test} from './utils/test'

const manifestMissingSlug = sinon.stub()
manifestMissingSlug.withArgs('addon_manifest.json').returns(JSON.stringify({}))

describe('ReadManifest', () => {
  test
    .it('.run', () => {
      expect(ReadManifest.run()).to.be.a('string')
    })
  test
    .it('.json', () => {
      expect(manifest).to.deep.equal(manifest)
    })
  test
    .stub(fs, 'readFileSync', manifestMissingSlug)
    .do(async () => ReadManifest.json())
    .catch(err => {
      expect(err.message).to.eq('No slug found in manifest')
    })
    .it('.json throws error when no slug')
})

const writeManifest = `{
  "id": "slug"
}`

const fsWriteFileSync = sinon.stub()
fsWriteFileSync.throws('write not stubbed')
fsWriteFileSync.withArgs('addon_manifest.json', writeManifest).returns(undefined)

describe('WriteManifest', () => {
  test
    .stub(fs, 'writeFileSync', fsWriteFileSync)
    .it('.run', () => {
      expect(WriteManifest.run(JSON.parse(writeManifest))).to.be.a('undefined')
      expect(fsWriteFileSync.called).to.eq(true)
    })
})

describe('LogManifest', () => {
  test
    .stdout()
    .it('.run', ctx => {
      expect(LogManifest.run(manifest)).to.be.a('undefined')
      expect(ctx.stdout).to.deep.equal(`{
 "id": "testing-123",
 "name": "MyAddon",
 "api": {
  "config_vars_prefix": "MYADDON",
  "config_vars": [
   "MYADDON_URL"
  ],
  "password": "bv95AM7726CwVQ7cHUSKuOb3tTREDdVn",
  "sso_salt": "KtdFl80yzJvkEvq7bmJuQkuXKtV2nx6T",
  "regions": [
   "us",
   "eu"
  ],
  "requires": [],
  "production": {
   "base_url": "https://myaddon.com/heroku/resources",
   "sso_url": "https://myaddon.com/sso/login"
  },
  "test": {
   "base_url": "http://localhost:4567/heroku/resources",
   "sso_url": "http://localhost:4567/sso/login"
  },
  "version": "3"
 }
}
`)
    })
})
