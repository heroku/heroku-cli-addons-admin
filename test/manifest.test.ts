import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as sinon from 'sinon'

import {GenerateManifest, ReadManifest} from '../src/manifest'

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
