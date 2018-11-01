/* tslint:disable */
import {expect} from '@oclif/test';
import test from '../../../../utils/test';

import { writeFileSync } from 'fs';

// test manifest
const manifest = require('./../../../../fixture/addon_manifest');
// host for API isolation test
const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

describe('addons:admin:manifest:push', () => {
  const pushTest = test
  .nock(host, (api: any) => {
    api.post('/provider/addons', JSON.stringify(manifest))
    .reply(200, manifest)
  });

  pushTest
  .stdout()
  .command(['addons:admin:manifest:push'])
  .it('stdout contains manifest elements', (ctx:any) => {
   Object.keys(manifest).forEach(key => {
     if(key !== 'api') expect(ctx.stdout).to.contain(manifest[key])
   })
  });

  test
  .nock(host, (api: any) => {
    api.post('/provider/addons', JSON.stringify(manifest))
    .replyWithError(400)
  })
  .stdout()
  .stderr()
  .command(['addons:admin:manifest:push'])
  .catch((err: any) => {
    expect(err).to.be.an('error');
  })
  .it('error testing')
})
