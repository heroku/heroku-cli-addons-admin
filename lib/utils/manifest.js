"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let manifest = {
    id: "myaddon",
    name: "MyAddon",
    api: {
        config_vars_prefix: "MYADDON",
        config_vars: [
            "MYADDON_URL"
        ],
        password: "CHANGEME",
        sso_salt: "CHANGEME",
        regions: ["us", "eu"],
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
};
const generateManifest = (data = {}) => {
    manifest.id = data.id || manifest.id;
    manifest.name = data.name || manifest.name;
    manifest.api.config_vars_prefix = (data.name ? data.name.toUpperCase() : manifest.api.config_vars_prefix);
    manifest.api.config_vars = (data.name ? [`${data.name.toUpperCase()}_URL`] : manifest.api.config_vars);
    manifest.api.password = data.password || manifest.api.password;
    manifest.api.sso_salt = data.sso_salt || manifest.api.sso_salt;
    return manifest;
};
exports.default = generateManifest;
