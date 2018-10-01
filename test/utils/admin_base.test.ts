import Nock from '@fancy-test/nock'
import * as Test from '@oclif/test'
import {stat} from 'fs'

import AdminBase from '../../src/admin_base'

const test = Test.test
  .register('nock', Nock)
const expect = Test.expect

describe('base functions', () => {
  test
    .nock('https://api.heroku.com', (nock: any) => {
      nock
      .get('/account')
        .reply(200, {email: 'name@example.com'}
    })
  .it('email()', async () => {
    const email_response = await AdminBase.email()
    expect(email_response).to.equal('name@example.com')
  })
})


describe('manifest util functions', () => {
  // TODO: Stub out filesystem here so that we aren't depending on
  // addon-manifest.json actually being created
  test
  .do(async () => {
    await stat('addon_manifest.json', err => {
      if (err === null) {
        manifestExist = true
      }
    })
  })
  .it('readManifest()', () => {
    if (manifestExist) {
      if (manifestExist) {
        const manifest = JSON.parse(readManifest())
        expect(manifest).to.be.a('object')
      }
    }
  })

  test
  .it('this.generateManifest', () => {
    expect(this.generateManifest()).to.be.a('object')
  })
})
