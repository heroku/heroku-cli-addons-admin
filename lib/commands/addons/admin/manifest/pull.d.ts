import CommandExtension from '../../../../CommandExtension';
export default class Pull extends CommandExtension {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("../../../../../node_modules/@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: {
        name: string;
    }[];
    run(): Promise<void>;
}
