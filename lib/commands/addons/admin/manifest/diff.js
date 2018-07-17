"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CommandExtension
const CommandExtension_1 = require("../../../../CommandExtension");
// heroku-cli
const color_1 = require("@heroku-cli/color");
// other packages
const cli_ux_1 = require("cli-ux");
const fs_1 = require("fs");
const diff_1 = require("diff");
class Diff extends CommandExtension_1.default {
    async run() {
        const { args, flags } = this.parse(Diff);
        const { body: account } = await this.heroku.get('/account', { retryAuth: false });
        // checks if user is logged in, in case default user checking measures do not work
        if (!account) {
            this.error(color_1.default.red('Please login with Heroku credentials using `heroku login`.'));
        }
        let email = account.email;
        // reading current manifest
        const manifest = fs_1.readFileSync('addon_manifest.json', 'utf8');
        if (!manifest) {
            this.error('No manifest found. Please generate a manifest before pushing.');
        }
        const slug = JSON.parse(manifest).id;
        // GET request
        cli_ux_1.default.action.start(`Fetching add-on manifest for ${color_1.default.addon(slug)}`);
        const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';
        let defaultOptions = {
            headers: {
                authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'kensa future'
            }
        };
        const { body } = await this.heroku.get(`${host}/provider/addons/${slug}`, defaultOptions); // manifest fetched
        cli_ux_1.default.action.stop();
        const fetchedManifest = JSON.stringify(body, null, 2);
        const diff = diff_1.diffLines(fetchedManifest, manifest, { newlineIsToken: true, ignoreCase: true });
        this.log(`${color_1.default.yellow('Disclaimer:')} Some values may be repeated, but are in different positions.`);
        diff.forEach(part => {
            const outputColor = part.added ? 'green' :
                part.removed ? 'red' : 'white';
            console.log(color_1.default[outputColor](part.value));
        });
    }
}
Diff.description = 'compares remote manifest to local manifest and finds differences';
exports.default = Diff;
