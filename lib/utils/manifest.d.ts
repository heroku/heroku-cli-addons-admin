interface ManifestInterface {
    id: string;
    name: string;
    api: ManifestAPIInterface;
    $base?: string;
}
interface ManifestAPIInterface {
    config_vars_prefix: string;
    config_vars: string[];
    password: string;
    sso_salt: string;
    regions: string[];
    requires: string[];
    production: {
        base_url: string;
        sso_url: string;
    };
    test: {
        base_url: string;
        sso_url: string;
    };
    version: string;
}
declare const generateManifest: (data?: any) => ManifestInterface;
export default generateManifest;
export { ManifestInterface, ManifestAPIInterface };
