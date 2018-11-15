import {test as oTest} from '@oclif/test'

import * as fs from 'fs-extra'
import * as sinon from 'sinon'

const manifest = require('./../fixture/addon_manifest')

const fsReadFileSync = sinon.stub()
fsReadFileSync.throws('read not stubbed')
fsReadFileSync.withArgs('addon-manifest.json').returns(JSON.stringify(manifest))

const fsWriteFileSync = sinon.stub()
fsWriteFileSync.throws('write not stubbed')
fsWriteFileSync.withArgs('addon-manifest.json').returns(undefined)

const test = oTest
.stub(fs, 'readFileSync', fsReadFileSync)
.stub(fs, 'writeFileSync', fsWriteFileSync)
.stdout()
.stderr()

// host for API isolation test
const host = (process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com')

export default test

export {
  test,
  manifest,
  host
}
