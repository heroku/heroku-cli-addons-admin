import {expect, test} from '@oclif/test'

import {GenerateManifest} from '../src/manifest'

describe('GenerateManifest', () => {
  test
    .it('.run', () => {
      expect(GenerateManifest.run()).to.be.a('object')
    })
})
