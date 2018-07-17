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
const inquirer_1 = require("inquirer");
const randomstring_1 = require("randomstring");
// utils
const manifest_1 = require("../../../../utils/manifest");
class Generate extends CommandExtension_1.default {
    async run() {
        const { flags } = this.parse(Generate);
        const { body: account } = await this.heroku.get('/account', { retryAuth: false });
        // checks if user is logged in, in case default user checking measures do not work
        if (!account) {
            this.error(color_1.default.red('Please login with Heroku credentials using `heroku login`.'));
        }
        // prompts for manifest
        let manifest = manifest_1.default();
        this.log(color_1.default.green('Input manifest information below: '));
        const questions = [{
                type: 'input',
                name: 'id',
                message: 'Enter slugname/manifest id:',
                default: flags.slug,
                validate: (input) => {
                    if (input.trim() === '' || !isNaN(input)) {
                        this.error('Please use a string as a slug name.');
                        return false;
                    }
                    return true;
                },
            }, {
                type: 'input',
                name: 'name',
                message: 'Addon name (Name displayed to on addon dashboard):',
                default: flags.addon || 'MyAddon',
            }, {
                type: 'confirm',
                name: 'toGenerate',
                message: 'Would you like to generate the password and sso_salt?',
                default: true,
            }];
        await inquirer_1.prompt(questions).then(answers => {
            const promptAnswers = answers; // asserts type to answers param
            if (promptAnswers.toGenerate) {
                promptAnswers.password = randomstring_1.generate(32);
                promptAnswers.sso_salt = randomstring_1.generate(32);
            }
            manifest = manifest_1.default(answers);
        });
        // generating manifest
        const manifestObj = JSON.stringify(manifest, null, 2);
        cli_ux_1.default.action.start('Generating addon_manifest');
        fs_1.writeFile('addon_manifest.json', manifestObj, (err) => {
            // console.log('Generating addon_manifest.json...')
            cli_ux_1.default.action.stop(color_1.default.green('done'));
            if (err) {
                console.log('The file has not been saved: \n', err);
                return;
            }
            console.log('The file has been saved!');
        });
    }
}
Generate.description = 'generate a manifest template';
Generate.examples = [`$ oclif-example addons:admin:generate
The file has been saved!`,];
Generate.flags = {
    help: command_1.flags.help({ char: 'h' }),
    slug: command_1.flags.string({
        char: 's',
        description: 'slugname/manifest id'
    }),
    addon: command_1.flags.string({
        char: 'a',
        description: 'addon name (name displayed to on addon dashboard)',
    })
};
exports.default = Generate;
