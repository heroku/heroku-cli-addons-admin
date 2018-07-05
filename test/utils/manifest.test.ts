/* tslint:disable */
import { expect, test } from '@oclif/test';
import { stat } from 'fs';

import Generate from '../../src/commands/addons/admin/manifest/generate';
import { generateManifest, readManifest } from '../../src/utils/manifest';

let manifestExist: boolean = false;


describe('manifest util functions', () => {
  test
  .do(async () => {
    await stat('addon_manifest.json', (err) => {
      if (err === null) {
        manifestExist = true;
      }
    })
  })
  .it('readManifest()', () => {
    if(manifestExist) {
      if (manifestExist) {
        const manifest = JSON.parse(readManifest.apply(Generate))
        expect(manifest).to.be.a('object');
      }
    }
  })

  test
  .it('generateManifest', () => {
    expect(generateManifest()).to.be.a('object');
  })
});
