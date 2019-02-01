import {expect, test} from '@oclif/test'
import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import * as randomstring from 'randomstring'
import * as sinon from 'sinon'

import {manifest} from '../../../../utils/test'

describe('addons:admin:manifest:generate', () => {
  const fsWriteFileSync = sinon.stub()
  fsWriteFileSync.throws('write not stubbed')
  fsWriteFileSync.withArgs('addon-manifest.json', JSON.stringify(manifest, null, 2)).returns(undefined)

  const fsWriteFileNotCalled = sinon.stub()
  fsWriteFileNotCalled.throws('write not stubbed')

  const generateTest = test
    .stdout()
    .stderr()
    .nock('https://api.heroku.com', (api: any) => api
      .get('/regions')
      .reply(200, [{name: 'us'}, {name: 'eu'}])
    )

  const promptWriteFalse = sinon.stub()
  promptWriteFalse.returns(Promise.resolve({
    toGenerate: false,
    toWrite: false
  }))

  generateTest
    .stub(inquirer, 'prompt', promptWriteFalse)
    .stdout()
    .command(['addons:admin:manifest:generate'])
    .catch(() => {})
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('addon-manifest.json will not be created. Have a good day!')
    })

  const promptGenerateFalse = sinon.stub()
  promptGenerateFalse.returns(Promise.resolve({
    toGenerate: false,
    toWrite: true
  }))

  const defaultManifest = `{
  "id": "myaddon",
  "api": {
    "config_vars_prefix": "MYADDON",
    "config_vars": [
      "MYADDON_URL"
    ],
    "password": "CHANGEME",
    "sso_salt": "CHANGEME",
    "regions": [
      "us",
      "eu"
    ],
    "requires": [],
    "production": {
      "base_url": "https://myaddon.com/heroku/resources",
      "sso_url": "https://myaddon.com/sso/login"
    },
    "version": "3"
  },
  "name": "MyAddon"
}`

  const mock: any = (filename: any, manifest: any, callback: any) => {
    mock.filename = filename
    mock.manifest = manifest
    callback()
  }

  generateTest
    .stdout()
    .stub(fs, 'writeFile', mock)
    .stub(inquirer, 'prompt', promptGenerateFalse)
    .command(['addons:admin:manifest:generate'])
    .it('runs', ctx => {
      expect(mock.filename).to.eq('addon-manifest.json')
      expect(mock.manifest).to.eq(defaultManifest)
      expect(ctx.stdout).to.contain('The file addon-manifest.json has been saved!')
    })

  const promptGenerateTrue = sinon.stub()
  promptGenerateTrue.returns(Promise.resolve({
    toGenerate: true,
    toWrite: true
  }))

  const generatedManifest = `{
  "id": "myaddon",
  "api": {
    "config_vars_prefix": "MYADDON",
    "config_vars": [
      "MYADDON_URL"
    ],
    "password": "a",
    "sso_salt": "b",
    "regions": [
      "us",
      "eu"
    ],
    "requires": [],
    "production": {
      "base_url": "https://myaddon.com/heroku/resources",
      "sso_url": "https://myaddon.com/sso/login"
    },
    "version": "3"
  },
  "name": "MyAddon"
}`

  const randomMock = sinon.stub()
    .onCall(0).returns('a')
    .onCall(1).returns('b')

  generateTest
    .stdout()
    .stub(fs, 'writeFile', mock)
    .stub(inquirer, 'prompt', promptGenerateTrue)
    .stub(randomstring, 'generate', randomMock)
    .command(['addons:admin:manifest:generate'])
    .it('runs', ctx => {
      expect(mock.filename).to.eq('addon-manifest.json')
      expect(mock.manifest).to.eq(generatedManifest)
      expect(ctx.stdout).to.contain('The file addon-manifest.json has been saved!')
    })

  const promptGenerateOptions = sinon.stub()
  promptGenerateOptions.returns(Promise.resolve({
    id: 'slug',
    name: 'name',
    regions: ['us', 'eu', 'dublin'],
    toGenerate: false,
    toWrite: true
  }))

  const optionsManifest = `{
  "id": "slug",
  "api": {
    "config_vars_prefix": "SLUG",
    "config_vars": [
      "SLUG_URL"
    ],
    "password": "CHANGEME",
    "sso_salt": "CHANGEME",
    "regions": [
      "us",
      "eu",
      "dublin"
    ],
    "requires": [],
    "production": {
      "base_url": "https://myaddon.com/heroku/resources",
      "sso_url": "https://myaddon.com/sso/login"
    },
    "version": "3"
  },
  "name": "name"
}`

  generateTest
    .stdout()
    .stub(fs, 'writeFile', mock)
    .stub(inquirer, 'prompt', promptGenerateOptions)
    .command(['addons:admin:manifest:generate'])
    .it('runs', () => {
      expect(mock.filename).to.eq('addon-manifest.json')
      expect(mock.manifest).to.eq(optionsManifest)
    })

  const promptGenerateDashOptions = sinon.stub()
  promptGenerateDashOptions.returns(Promise.resolve({
    id: 'slug-with-dash',
    name: 'name',
    regions: ['us'],
    toGenerate: false,
    toWrite: true
  }))

  const optionsDashManifest = `{
  "id": "slug-with-dash",
  "api": {
    "config_vars_prefix": "SLUG_WITH_DASH",
    "config_vars": [
      "SLUG_WITH_DASH_URL"
    ],
    "password": "CHANGEME",
    "sso_salt": "CHANGEME",
    "regions": [
      "us"
    ],
    "requires": [],
    "production": {
      "base_url": "https://myaddon.com/heroku/resources",
      "sso_url": "https://myaddon.com/sso/login"
    },
    "version": "3"
  },
  "name": "name"
}`

  generateTest
    .stdout()
    .stub(fs, 'writeFile', mock)
    .stub(inquirer, 'prompt', promptGenerateDashOptions)
    .command(['addons:admin:manifest:generate'])
    .it('runs', () => {
      expect(mock.manifest).to.eq(optionsDashManifest)
    })
})
