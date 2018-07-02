/* tslint:disable */
import {expect, test} from '@oclif/test';

import { writeFileSync } from 'fs';

// test manifest
const manifest = require('./../../../../fixture/addon_manifest');

// host for API isolation test
const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

describe('addons:admin:manifest:push', () => {
  const pushTest = test
  .nock('https://api.heroku.com', (api: any) => api
    .get('/account')
    .reply(200, {email: 'aman.ibrahim@heroku.com'})
  )
  .nock(host, (api: any) => {
    api.post('/provider/addons', manifest)
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


  // test
  // .do(() => {  writeFileSync('addon_manifest.json', '') })
  // .nock('https://api.heroku.com', (api: any) => api
  //   .get('/account')
  //   .reply(200, {email: 'aman.ibrahim@heroku.com'})
  // )
  // .nock(host, (api: any) => {
  //   api.post('/provider/addons', '')
  //   .replyWithError(400)
  // })
  // .stdout()
  // .stderr()
  // .command(['addons:admin:manifest:push'])
  // .catch((err: any) => {
  //   expect(err).to.be.an('error');
  // })
  // .it('error testing')
})
