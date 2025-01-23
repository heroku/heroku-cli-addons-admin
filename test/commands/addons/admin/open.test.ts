import * as open from 'open'
import * as sinon from 'sinon'
import {expect} from '@oclif/test'
import {test} from '../../../utils/test'
import Cmd from '../../../../src/commands/addons/admin/open'

describe('addons:admin:open', () => {
  const openArg = sinon.stub()
  openArg.throws('not stubbed')
  openArg.withArgs('https://addons-next.heroku.com/addons/arg-slug').returns(undefined)

  test
    .stub(Cmd, 'urlOpener', () => openArg)
    .command(['addons:admin:open', 'arg-slug'])
    .it('opens slug in args', () => {
      expect(openArg.called).to.eq(true)
    })

  const openManifest = sinon.stub()
  openManifest.throws('not stubbed')
  openManifest.withArgs('https://addons-next.heroku.com/addons/testing-123').returns(undefined)

  test
    .stub(Cmd, 'urlOpener', () => openManifest)
    .command(['addons:admin:open'])
    .it('opens slug in args', () => {
      expect(openManifest.called).to.eq(true)
    })
})
