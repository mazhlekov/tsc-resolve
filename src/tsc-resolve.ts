import * as path from "path";
const tsconfig = require("tsconfig");

import {
    rtrim, validateTsConfig, escapeRegExp, convertToUnixPath,
    TypescriptModule, FileReplace, replaceInFile, getJSFiles
} from "./utils";

function getFileReplaceTask(outDir: string, filePath: string, modules: TypescriptModule[]) {
    let replaces: FileReplace[] = [];

    for (let module of modules) {
        const moduleDir = path.resolve(outDir, module.path);
        let diff = path.relative(path.resolve(moduleDir, path.dirname(filePath)), moduleDir);
        diff = convertToUnixPath(diff);

        if (!(diff.lastIndexOf(".", 0) === 0)) {
            diff = "./" + diff;
        }

        const regExp1 = new RegExp(escapeRegExp(`require("${module.name}")`), "g");
        const replaceText1 = `require("` + diff + `")`;

        const regExp2 = new RegExp(escapeRegExp(`require("${module.name}/`), "g");
        let replaceText2 = `require("` + diff;
        if (diff !== "./") {
            replaceText2 += "/";
        }

        replaces.push({ regExp: regExp1, text: replaceText1 });
        replaces.push({ regExp: regExp2, text: replaceText2 });
    }

    return replaceInFile(filePath, replaces);
}

export async function resolve(tsConfigFilePath: string) {
    const config: any = await tsconfig.readFile(tsConfigFilePath);
    validateTsConfig(config);

    const outDir = path.resolve(path.dirname(tsConfigFilePath), config.compilerOptions.outDir);

    const jsFiles: string[] = getJSFiles(outDir);

    if (!jsFiles.length) {
        throw new Error("No .js files found");
    }

    const modules = Object.keys(config.compilerOptions.paths);

    await Promise.all(
        jsFiles.map((filePath: string) => {
            let tsModules: TypescriptModule[] = [];
            for (const moduleName of modules) {
                const modulePath = rtrim(config.compilerOptions.paths[moduleName][0], "*"); // Remove trailing *s
                tsModules.push({ name: moduleName, path: modulePath });
            }
            return getFileReplaceTask(outDir, filePath, tsModules);
        })
    );
}