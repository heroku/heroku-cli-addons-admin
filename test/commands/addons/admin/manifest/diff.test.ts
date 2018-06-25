import {expect, test, FancyTypes} from '@oclif/test';

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
  .stdout()
  .command(['addons:admin:manifest:diff'])
  .it('contains static stdout', (ctx:any) => {
    expect(ctx.stdout).to.contain('Some values may be repeated, but are in different positions.')
  });

  test
  .stdout({print: true})
  .command(['addons:admin:manifest:diff'])
  .it('contains all elements', (ctx: any) => {
    console.log('ctx:', test)
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

  test.nock(host, (api: any) => {
    api.get('/provider/addons/testing-123')
    .reply(200, {body: testManifest})
  })
  .stdout()
  .command(['addons:admin:manifest:diff'])
  .it('contains correct test API elements', (ctx: any) => {
    expect(ctx.stdout).to.contain(`"test": "${testManifest.test}"`);
  })
})
