export declare const CONFIG_FILENAME = "tsconfig.json";
export interface TypescriptModule {
    readonly name: string;
    readonly path: string;
}
export interface FileReplace {
    readonly regExp: RegExp;
    readonly text: string;
}
export declare function getJSFiles(dir: string, files?: string[]): string[];
export declare function replaceInFile(filePath: string, replaces: FileReplace[]): Promise<void>;
export declare function rtrim(str: string, char: string): string;
export declare function escapeRegExp(expr: string): string;
export declare function convertToUnixPath(path: string): string;
export declare function validateTsConfig(config: any): void;
export declare function endsWith(str: string, suffix: string): boolean;
