import { Command } from '@heroku-cli/command';
export default abstract class CommandExtension extends Command {
    _qq: any;
    readonly qq: any;
}
