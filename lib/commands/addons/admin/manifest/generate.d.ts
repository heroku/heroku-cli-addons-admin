import CommandExtension from '../../../../CommandExtension';
import { flags } from '@heroku-cli/command';
export default class Generate extends CommandExtension {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("../../../../../node_modules/@oclif/parser/lib/flags").IBooleanFlag<void>;
        slug: flags.IOptionFlag<string | undefined>;
        addon: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
