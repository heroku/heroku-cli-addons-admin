import CommandExtension from '../../../../CommandExtension';
export default class Push extends CommandExtension {
    static description: string;
    static flags: {
        help: import("../../../../../node_modules/@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static examples: string[];
    run(): Promise<void>;
}
