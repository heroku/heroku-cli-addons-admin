let manifest: any
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
  manifest.password = data.password || manifest.password;
  manifest.sso_salt = data.sso_salt || manifest.sso_salt;

  return manifest;
}


export default generateManifest;
