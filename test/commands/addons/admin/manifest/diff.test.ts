/* tslint:disable */
import {expect, test} from '@oclif/test';

// test addon
const manifest = require('./../../../../../addon_manifest');

// mandatory elements in a single manifest document (refer to /src/utils/manifest.ts)
const manifestElements: string[] = ['id', 'name', 'api'];
const manifestAPIElements: string[] = [
  'config_vars_prefix',
  'config_vars',
  'password',
  'sso_salt',
  'regions',
  'requires',
  'production',
  'test',
  'version'
];
const otherElements = ['base_url', 'sso_url'];

// host for API isolation test
const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';
const testManifest = {
  test: 'testing'
};


describe('addons:admin:manifest:diff', () => {
  test
  .nock('https://api.heroku.com', (api: any) => api
    .get('/account')
    .reply(200, {email: 'aman.ibrahim@heroku.com'})
  )
  .nock(host, (api: any) => api
    .get('/provider/addons/testing-123')
    .reply(200, manifest)
  )
  .stdout()
  .command(['addons:admin:manifest:diff'])
  .it('contains static stdout', (ctx:any) => {
    expect(ctx.stdout).to.contain('testing-123')
  });

  test
  .nock('https://api.heroku.com', (api: any) => api
    .get('/account')
    .reply(200, {email: 'aman.ibrahim@heroku.com'})
  )
  .nock(host, (api: any) => api
    .get('/provider/addons/testing-123')
    .reply(200, manifest)
  )
  .stdout()
  .command(['addons:admin:manifest:diff'])
  .it('contains all elements', (ctx: any) => {
    manifestElements.forEach(val => {
      expect(ctx.stdout).to.contain(val);
    });
    manifestAPIElements.forEach(val => {
      expect(ctx.stdout).to.contain(val);
    });
    otherElements.forEach(val => {
      expect(ctx.stdout).to.contain(val);
    });
  })

  test
  .nock('https://api.heroku.com', (api: any) => api
    .get('/account')
    .reply(200, {email: 'aman.ibrahim@heroku.com'})
  )
  .nock(host, (api: any) => {
    api.get('/provider/addons/testing-123')
    .reply(200, {body: testManifest})
  })
  .stdout()
  .command(['addons:admin:manifest:diff'])
  .it('contains correct test API elements', (ctx: any) => {
    expect(ctx.stdout).to.contain(`"test": "${testManifest.test}"`);
  })

  test
  .nock('https://api.heroku.com', (api: any) => api
    .get('/account')
    .reply(200, {email: 'aman.ibrahim@heroku.com'})
  )
  .nock(host, (api: any) => {
    try {
      api.get('/provider/addons/testing-123')
      .replyWithError('test')
    } catch (err) {
      expect(err).to.exist;
    }
  })
  .stdout({ print: true })
  .stderr({ print: true })
  .command(['addons:admin:manifest:diff'])
  .it('error testing', (ctx: any) => {
    console.log('etst', ctx.stderr)
  })
})
