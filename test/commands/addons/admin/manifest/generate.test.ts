import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../../../src/commands/addons/admin/manifest/generate.js'
import {createTestManifest} from '../../../../utils/test.js'

// Note: This test suite focuses on testing the generate() method logic rather than
// the interactive prompts (askQuestions, writeManifest). Testing interactive prompts
// with inquirer in ESM is challenging and would require additional mocking libraries.
// The core manifest generation logic is thoroughly tested here.
describe('addons:admin:manifest:generate', () => {
  let originalCwd: string
  let cleanup: () => void

  beforeEach(() => {
    const {cleanup: cleanupFn, testDir} = createTestManifest()
    cleanup = cleanupFn
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    nock.cleanAll()
    process.chdir(originalCwd)
    cleanup()
  })

  describe('generate() method', () => {
    it('creates default manifest with no data', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate()

      expect(manifest.id).to.eq('myaddon')
      expect(manifest.name).to.eq('MyAddon')
      expect(manifest.api.config_vars_prefix).to.eq('MYADDON')
      expect(manifest.api.config_vars).to.deep.eq(['MYADDON_URL'])
      expect(manifest.api.password).to.eq('CHANGEME')
      expect(manifest.api.sso_salt).to.eq('CHANGEME')
      expect(manifest.api.regions).to.deep.eq(['us', 'eu'])
    })

    it('generates manifest with custom id', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({id: 'myslug'})

      expect(manifest.id).to.eq('myslug')
      expect(manifest.api.config_vars_prefix).to.eq('MYSLUG')
      expect(manifest.api.config_vars).to.deep.eq(['MYSLUG_URL'])
    })

    it('generates manifest with dashed slug', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({id: 'slug-with-dash'})

      expect(manifest.id).to.eq('slug-with-dash')
      expect(manifest.api.config_vars_prefix).to.eq('SLUG_WITH_DASH')
      expect(manifest.api.config_vars).to.deep.eq(['SLUG_WITH_DASH_URL'])
    })

    it('generates manifest with custom password and salt', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        password: 'custom-password',
        sso_salt: 'custom-salt',
      })

      expect(manifest.api.password).to.eq('custom-password')
      expect(manifest.api.sso_salt).to.eq('custom-salt')
    })

    it('generates manifest with custom regions', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        regions: ['us', 'eu', 'dublin'],
      })

      expect(manifest.api.regions).to.deep.eq(['us', 'eu', 'dublin'])
    })

    it('generates manifest with custom name', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        id: 'slug',
        name: 'CustomName',
      })

      expect(manifest.id).to.eq('slug')
      expect(manifest.name).to.eq('CustomName')
    })
  })

  describe('manifest structure validation', () => {
    it('generates manifest with all required fields', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate()

      // Check top-level fields
      expect(manifest).to.have.property('id')
      expect(manifest).to.have.property('name')
      expect(manifest).to.have.property('api')

      // Check API fields
      expect(manifest.api).to.have.property('config_vars')
      expect(manifest.api).to.have.property('config_vars_prefix')
      expect(manifest.api).to.have.property('password')
      expect(manifest.api).to.have.property('sso_salt')
      expect(manifest.api).to.have.property('regions')
      expect(manifest.api).to.have.property('requires')
      expect(manifest.api).to.have.property('production')
      expect(manifest.api).to.have.property('version')

      // Check production fields
      expect(manifest.api.production).to.have.property('base_url')
      expect(manifest.api.production).to.have.property('sso_url')
    })

    it('generates valid JSON structure', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        id: 'test-addon',
        name: 'Test Addon',
        password: 'testpass',
        regions: ['us'],
      })

      // Should be JSON serializable
      const json = JSON.stringify(manifest)
      const parsed = JSON.parse(json)
      expect(parsed).to.deep.equal(manifest)
    })
  })
})
