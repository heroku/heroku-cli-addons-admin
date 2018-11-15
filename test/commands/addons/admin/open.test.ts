import {expect} from '@oclif/test'

import cli from 'cli-ux'
import * as sinon from 'sinon'

import {test} from '../../../utils/test'

describe('addons:admin:open', () => {
  const openArg = sinon.stub()
  openArg.throws('not stubbed')
  openArg.withArgs('https://addons-next.heroku.com/addons/arg-slug').returns(undefined)

  test
    .stub(cli, 'open', () => openArg)
    .command(['addons:admin:open', 'arg-slug'])
    .it('opens slug in args', () => {
      expect(openArg.called).to.eq(true)
    })

  const openManifest = sinon.stub()
  openManifest.throws('not stubbed')
  openManifest.withArgs('https://addons-next.heroku.com/addons/testing-123').returns(undefined)

  test
    .stub(cli, 'open', () => openManifest)
    .command(['addons:admin:open'])
    .it('opens slug in args', () => {
      expect(openManifest.called).to.eq(true)
    })
})
