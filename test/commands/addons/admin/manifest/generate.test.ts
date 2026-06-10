import nock from 'nock'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

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

      expect(manifest.id).toBe('myaddon')
      expect(manifest.name).toBe('MyAddon')
      expect(manifest.api.config_vars_prefix).toBe('MYADDON')
      expect(manifest.api.config_vars).toEqual(['MYADDON_URL'])
      expect(manifest.api.password).toBe('CHANGEME')
      expect(manifest.api.sso_salt).toBe('CHANGEME')
      expect(manifest.api.regions).toEqual(['us', 'eu'])
    })

    it('generates manifest with custom id', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({id: 'myslug'})

      expect(manifest.id).toBe('myslug')
      expect(manifest.api.config_vars_prefix).toBe('MYSLUG')
      expect(manifest.api.config_vars).toEqual(['MYSLUG_URL'])
    })

    it('generates manifest with dashed slug', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({id: 'slug-with-dash'})

      expect(manifest.id).toBe('slug-with-dash')
      expect(manifest.api.config_vars_prefix).toBe('SLUG_WITH_DASH')
      expect(manifest.api.config_vars).toEqual(['SLUG_WITH_DASH_URL'])
    })

    it('generates manifest with custom password and salt', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        password: 'custom-password',
        sso_salt: 'custom-salt',
      })

      expect(manifest.api.password).toBe('custom-password')
      expect(manifest.api.sso_salt).toBe('custom-salt')
    })

    it('generates manifest with custom regions', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        regions: ['us', 'eu', 'dublin'],
      })

      expect(manifest.api.regions).toEqual(['us', 'eu', 'dublin'])
    })

    it('generates manifest with custom name', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        id: 'slug',
        name: 'CustomName',
      })

      expect(manifest.id).toBe('slug')
      expect(manifest.name).toBe('CustomName')
    })
  })

  describe('manifest structure validation', () => {
    it('generates manifest with all required fields', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate()

      expect(manifest).toHaveProperty('id')
      expect(manifest).toHaveProperty('name')
      expect(manifest).toHaveProperty('api')

      expect(manifest.api).toHaveProperty('config_vars')
      expect(manifest.api).toHaveProperty('config_vars_prefix')
      expect(manifest.api).toHaveProperty('password')
      expect(manifest.api).toHaveProperty('sso_salt')
      expect(manifest.api).toHaveProperty('regions')
      expect(manifest.api).toHaveProperty('requires')
      expect(manifest.api).toHaveProperty('production')
      expect(manifest.api).toHaveProperty('version')

      expect(manifest.api.production).toHaveProperty('base_url')
      expect(manifest.api.production).toHaveProperty('sso_url')
    })

    it('generates valid JSON structure', () => {
      const cmd = new Cmd([], {} as any)
      const manifest = (cmd as any).generate({
        id: 'test-addon',
        name: 'Test Addon',
        password: 'testpass',
        regions: ['us'],
      })

      const json = JSON.stringify(manifest)
      const parsed = JSON.parse(json)
      expect(parsed).toEqual(manifest)
    })
  })
})
