/* tslint:disable */
import CommandExtension from '../CommandExtension';

import { readFileSync } from 'fs';

interface ManifestInterface {
    id: string;
    name: string;
    api: ManifestAPIInterface;
    $base?: string;
}

interface ManifestAPIInterface {
    config_vars_prefix: string;
    config_vars: string[];
    password: string;
    sso_salt: string;
    regions: string[];
    requires: string[];
    production: {
      base_url: string;
      sso_url: string;
    };
    test: {
      base_url: string;
      sso_url: string;
    };
    version: string;
}

let manifest: ManifestInterface
 = {
  id: "myaddon",
  api: {
    config_vars_prefix: "MYADDON",
    config_vars: [
      "MYADDON_URL"
    ],
    password: "CHANGEME",
    sso_salt: "CHANGEME",
    regions: ["us","eu"],
    requires: [],
    production: {
      base_url: "https://myaddon.com/heroku/resources",
      sso_url: "https://myaddon.com/sso/login"
    },
    test: {
      base_url: "http://localhost:4567/heroku/resources",
      sso_url: "http://localhost:4567/sso/login"
    },
    version: "3"
  },
  name: "MyAddon",
}

const generateManifest = (data: any = {}) => {
  manifest.id = data.id || manifest.id;

  manifest.api.config_vars_prefix = (data.name ? data.name.toUpperCase() : manifest.api.config_vars_prefix);
  manifest.api.config_vars = (data.name ? [`${data.name.toUpperCase()}_URL`] : manifest.api.config_vars);

  manifest.api.password = data.password || manifest.api.password;
  manifest.api.sso_salt = data.sso_salt || manifest.api.sso_salt;

  manifest.api.regions = data.regions || manifest.api.regions;

  manifest.name = data.name || manifest.name;

  return manifest;
}

function readManifest (this: CommandExtension) {
  let manifest: string | undefined = undefined;
  try {
    manifest = readFileSync('addon_manifest.json', 'utf8');
  } catch (err) {
    this.error(`Check if addon_manifest.json exists in root. \n ${err}`);
  }
  if (!manifest) {
    this.error('No manifest found. Please generate a manifest first.');
  }
  return manifest;
}


export {
  generateManifest,
  readManifest,
  ManifestInterface,
  ManifestAPIInterface
}
