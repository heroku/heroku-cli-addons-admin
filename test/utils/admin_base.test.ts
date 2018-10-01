import Nock from '@fancy-test/nock'
import * as Test from '@oclif/test'
import {stat} from 'fs'

import AdminBase from '../../src/admin_base'

const test = Test.test
  .register('nock', Nock)
const expect = Test.expect

describe('base functions', () => {
  // TODO: figure out how to call async function here:
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
    const manifest = JSON.parse(AdminBase.readManifest())
    expect(manifest).to.be.a('object')
  })

  test
  .it('generateManifest', () => {
    expect(AdminBase.generateManifest()).to.be.a('object')
  })
})
