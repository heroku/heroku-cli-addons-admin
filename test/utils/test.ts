import {test as oTest} from '@oclif/test'

import * as fs from 'fs-extra'
import * as nock from 'nock'
import * as sinon from 'sinon'

const manifest = require('./../fixture/addon_manifest')

const fsReadFileSync = sinon.stub()
fsReadFileSync.throws('read not stubbed')
fsReadFileSync.withArgs('addon_manifest.json').returns(JSON.stringify(manifest))

const fsWriteFileSync = sinon.stub()
fsWriteFileSync.throws('write not stubbed')
fsWriteFileSync.withArgs('addon_manifest.json').returns(undefined)

const test = oTest
.do(() => {
  // fancy-test verifies it was called, we just want this stubbed for all tests
  nock('https://api.heroku.com')
  .get('/account')
  .reply(200, {email: 'aman@abc123.com'})
})
.stub(fs, 'readFileSync', fsReadFileSync)
.stub(fs, 'writeFileSync', fsWriteFileSync)

export default test
