/* tslint:disable */
import {expect} from '@oclif/test';
import { readFileSync, writeFileSync } from 'fs';

import test from '../../../../utils/test';

// test addon
const manifest = require('./../../../../fixture/addon_manifest');

// host for API isolation test
const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';

describe('addons:admin:manifest:pull', () => {
  const pullTest = test
  .nock(host, (api: any) => api
    .get('/provider/addons/testing-123')
    .reply(200, manifest)
  );

  pullTest
  .stdout()
  .command(['addons:admin:manifest:pull', 'testing-123'])
  .it('stdout contains manifest elements', (ctx:any) => {
    Object.keys(manifest).forEach(key => {
      if(key !== 'api') expect(ctx.stdout).to.contain(manifest[key])
    })
  });

  pullTest
  .stdout()
  .stderr()
  .command(['addons:admin:manifest:pull'])
  .it('pull grabs slug from manifest')

  test
  .nock(host, (api: any) => api
    .get('/provider/addons/fakeslug')
    .replyWithError(400)
  )
  .stdout()
  .command(['addons:admin:manifest:pull', 'fakeslug'])
  .catch(err => {
    expect(err).to.be.an('error');
  })
  .it('errors for fake slugs')
})
