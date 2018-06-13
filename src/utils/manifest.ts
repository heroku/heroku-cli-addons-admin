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
  name: "MyAddon",
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
  }
}

const generateManifest = (data: any = {}) => {
  manifest.id = data.id || manifest.id;
  manifest.name = data.name || manifest.name;
  manifest.api.password = data.password || manifest.api.password;
  manifest.api.sso_salt = data.sso_salt || manifest.api.sso_salt;

  return manifest;
}


export default generateManifest;
export {
  ManifestInterface,
  ManifestAPIInterface
}
