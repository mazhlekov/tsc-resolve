import * as Bluebird from "bluebird";
import * as path from "path";

const gracefulFs = require("graceful-fs");
const fs: any = Bluebird.promisifyAll(gracefulFs.gracefulify(require("fs")));

export const CONFIG_FILENAME = "tsconfig.json";

export interface ITypescriptModule {
    readonly name: string;
    readonly path: string;
}

export interface IFileReplace {
    readonly regExp: RegExp;
    readonly text: string;
}

export function getJSFiles(dir: string, files: string[] = []) {
    for (const file of fs.readdirSync(dir)) {
        const fileName: string = path.join(dir, file);

        if (fs.statSync(fileName).isDirectory()) {
            getJSFiles(fileName, files);
        } else {
            const fileExt = fileName.split(".").pop();
            if (fileExt === "js") {
                files.push(fileName);
            }
        }
    }
    return files;
}

export async function replaceInFile(filePath: string, replaces: IFileReplace[]) {
    let newSource = await fs.readFileAsync(filePath, "utf-8");
    for (const replace of replaces) {
        newSource = newSource.replace(replace.regExp, replace.text);
    }
    await fs.writeFileAsync(filePath, newSource, "utf-8");
}

export function rtrim(str: string, char: string): string {
    if (str.slice(str.length - char.length) === char) {
        return rtrim(str.slice(0, 0 - char.length), char);
    } else {
        return str;
    }
}

export function escapeRegExp(expr: string) {
    if (typeof expr !== "string") {
        throw new TypeError("Expected a string");
    }

    return expr.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

export function convertToUnixPath(path: string) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\x00-\x80]+/.test(path);

    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, "/");
}

export function validateTsConfig(config: any) {
    if (!config.compilerOptions) {
        throw new Error("Missing compilerOptions");
    }

    if (!config.compilerOptions.outDir) {
        throw new Error("Missing outDir");
    }

    if (!config.compilerOptions.paths) {
        throw new Error("Missing paths");
    }

    if (!Object.keys(config.compilerOptions.paths).length) {
        throw new Error("Missing paths");
    }

    for (const module in config.compilerOptions.paths) {
        if (config.compilerOptions.paths[module].length > 1) {
            throw new Error(`You cannot have more than one path per module. "${module}" is invalid =>
            ${config.compilerOptions.paths[module]}`);
        }
    }
}

export function endsWith(str: string, suffix: string) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
