import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import {GenerateManifest, LogManifest, ReadManifest, WriteManifest} from '../src/manifest'

import {manifest, test} from './utils/test'

describe('GenerateManifest', () => {
  test
    .it('.run', () => {
      expect(GenerateManifest.run()).to.be.a('object')
    })
})

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
      expect(LogManifest.run({id: 'slug'})).to.be.a('undefined')
      expect(ctx.stdout).to.deep.equal(`{
 "id": "slug"
}
`)
    })
})
