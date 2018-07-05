/* tslint:disable */
import { expect } from '@oclif/test';
import { stat } from 'fs';

import Generate from '../../src/commands/addons/admin/manifest/generate';
import { getEmail } from '../../src/utils/heroku';
import test from './test'

describe('heroku util functions', () => {
  test
  .it('getEmail()', async () => {
    const email = await getEmail.apply(Generate)
    expect(email).to.equal('aman@abc123.com')
  })
})
