"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@heroku-cli/command");
const qqjs = require("qqjs");
class CommandExtension extends command_1.Command {
    get qq() {
        if (this._qq)
            return this._qq;
        this._qq = qqjs;
        return this._qq;
    }
}
exports.default = CommandExtension;
