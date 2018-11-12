import {expect} from '@oclif/test'

import {GenerateManifest, ReadManifest} from '../src/manifest'

import test from './utils/test'

describe('GenerateManifest', () => {
  test
    .it('.run', () => {
      expect(GenerateManifest.run()).to.be.a('object')
    })
})

describe('ReadManifest', () => {
  test
    .it('.run', () => {
      expect(ReadManifest.run()).to.be.a('string')
    })
})
