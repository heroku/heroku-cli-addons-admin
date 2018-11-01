import * as Test from '@oclif/test'
import * as sinon from 'sinon';
import Nock from '@fancy-test/nock'
import {Command} from '@heroku-cli/command'
import {stat} from 'fs'

import AdminBase from '../../src/admin_base'

const test = Test.test
  .register('nock', Nock)
const expect = Test.expect

const heroku = sinon.createStubInstance(Command.APIClient)

describe('base functions', () => {
  test
    .nock('https://api.heroku.com', (nock: any) => {
      nock
        .get('/account')
        .reply(200, {email: 'name@example.com'})
    })
    .it('email()', async () => {
      const email_response = await AdminBase.email(heroku)
      expect(email_response).to.equal('name@example.com')
    })
})

describe('manifest util functions', () => {
  // TODO: Stub out filesystem here so that we aren't depending on
  // addon-manifest.json actually being created
  test
    .it('readManifest()', () => {
      let manifestString = AdminBase.readManifest()
      if (manifestString) {
        const manifest = JSON.parse(manifestString)
        expect(manifest).to.be.a('object')
      }
    })

  test
    .it('generateManifest', () => {
      expect(AdminBase.generateManifest()).to.be.a('object')
    })
})
