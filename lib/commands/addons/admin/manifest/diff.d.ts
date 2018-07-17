import CommandExtension from '../../../../CommandExtension';
export default class Diff extends CommandExtension {
    static description: string;
    run(): Promise<void>;
}
