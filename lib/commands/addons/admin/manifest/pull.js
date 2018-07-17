"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CommandExtension
const CommandExtension_1 = require("../../../../CommandExtension");
// heroku-cli
const command_1 = require("@heroku-cli/command");
const color_1 = require("@heroku-cli/color");
// other packages
const cli_ux_1 = require("cli-ux");
const fs_1 = require("fs");
class Pull extends CommandExtension_1.default {
    async run() {
        const { args, flags } = this.parse(Pull);
        // getting Heroku user data
        let { body: account } = await this.heroku.get('/account', { retryAuth: false });
        let email = account.email;
        // headers and data to sent addons API via http request
        let defaultOptions = {
            headers: {
                authorization: `Basic ${Buffer.from(email + ':' + this.heroku.auth).toString('base64')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'kensa future'
            }
        };
        const slug = args.slug;
        const host = process.env.HEROKU_ADDONS_HOST || 'https://addons.heroku.com';
        // GET request
        cli_ux_1.default.action.start(`Fetching add-on manifest for ${color_1.default.addon(slug)}`);
        const { body } = await this.heroku.get(`${host}/provider/addons/${slug}`, defaultOptions);
        cli_ux_1.default.action.stop();
        // writing addon_manifest.json
        const newManifest = Object.assign({ id: body.id, name: body.name }, body);
        console.log(color_1.default.bold(JSON.stringify(newManifest, null, 1)));
        cli_ux_1.default.action.start(`Updating ${color_1.default.blue('addon_manifest.json')}`);
        fs_1.writeFileSync('addon_manifest.json', JSON.stringify(newManifest, null, 2));
        cli_ux_1.default.action.stop();
    }
}
Pull.description = 'pull a manifest for a given slug';
Pull.examples = [
    `$ heroku addons:admin:manifest:pull testing-123
 ...
 Fetching add-on manifest for testing-123... done
 Updating addon_manifest.json... done`,
];
Pull.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
Pull.args = [{ name: 'slug' }];
exports.default = Pull;
