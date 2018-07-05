/* tslint:disable */
import { expect } from '@oclif/test';
import { stat } from 'fs';

import Generate from '../../src/commands/addons/admin/manifest/generate';
import { getEmail } from '../../src/utils/heroku';
import test from './test'

describe('heroku util functions', () => {
  test
  .it('getEmail()', () => {
    // console.log(getEmail.apply(Generate))
    // expect(getEmail.apply(Generate)).to.equal('aman@abc123.com')

  })
})
