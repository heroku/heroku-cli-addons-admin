
import {
  mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load JSON manually since require() is not available in ESM
const manifestPath = join(__dirname, '../fixture/addon_manifest.json')
const manifestContent = readFileSync(manifestPath, 'utf8')
const manifest = JSON.parse(manifestContent)

// host for API isolation test
const host = (process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com')

// Helper to create a temp directory with a manifest file
function createTestManifest(manifestData: any = manifest, filename = 'addon-manifest.json'): {cleanup: () => void; testDir: string;} {
  const testDir = mkdtempSync(join(tmpdir(), 'addon-test-'))
  // Only write the manifest if manifestData is not null
  if (manifestData !== null) {
    writeFileSync(join(testDir, filename), JSON.stringify(manifestData))
  }

  return {
    cleanup: () => rmSync(testDir, {force: true, recursive: true}),
    testDir,
  }
}

export {

  createTestManifest,
  host,
  manifest,

}
