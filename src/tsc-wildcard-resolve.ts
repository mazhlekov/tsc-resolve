import * as path from "path";
const tsconfig = require("tsconfig");

import {
    CONFIG_FILENAME,
    convertToUnixPath,
    endsWith,
    escapeRegExp,
    getJSFiles,
    IFileReplace,
    ITypescriptModule,
    replaceInFile,
    rtrim,
    validateTsConfig
} from "./utils";

function getFileReplaceTask(
    outDir: string,
    filePath: string,
    modules: ITypescriptModule[]
) {
    const replaces: IFileReplace[] = [];

    for (const module of modules) {
        const moduleDir = path
            .resolve(outDir, module.path)
            .replace("out\\dist\\src", "out\\dist\\")
            .replace("out/dist/src/", "out/dist/");
        const moduleName = module.name.replace(/\/\*$/, "");

        let diff = path.relative(
            path.resolve(moduleDir, path.dirname(filePath)),
            moduleDir
        );
        diff = convertToUnixPath(diff);

        if (!(diff.lastIndexOf(".", 0) === 0)) {
            diff = "./" + diff;
        }

        const regExp1 = new RegExp(
            escapeRegExp(`require("${moduleName}")`),
            "g"
        );
        const replaceText1 = `require("` + diff + `")`;

        const regExp2 = new RegExp(
            escapeRegExp(`require("${moduleName}/`),
            "g"
        );
        let replaceText2 = `require("` + diff;

        const regExp3 = new RegExp(
            escapeRegExp(`require('${moduleName}')`),
            "g"
        );
        const replaceText3 = `require('` + diff + `')`;

        const regExp4 = new RegExp(
            escapeRegExp(`require('${moduleName}/`),
            "g"
        );
        let replaceText4 = `require('` + diff;

        const regExp5 = new RegExp(escapeRegExp(`from '${moduleName}'`), "g");
        const replaceText5 = `from '` + diff + `'`;

        const regExp6 = new RegExp(escapeRegExp(`from '${moduleName}/`), "g");
        let replaceText6 = `from '` + diff;

        const regExp7 = new RegExp(escapeRegExp(`from "${moduleName}"`), "g");
        const replaceText7 = `from "` + diff + `"`;

        const regExp8 = new RegExp(escapeRegExp(`from "${moduleName}/`), "g");
        let replaceText8 = `from "` + diff;

        if (diff !== "./") {
            replaceText2 += "/";
            replaceText4 += "/";
            replaceText6 += "/";
            replaceText8 += "/";
        }

        replaces.push({ regExp: regExp1, text: replaceText1 });
        replaces.push({ regExp: regExp2, text: replaceText2 });
        replaces.push({ regExp: regExp3, text: replaceText3 });
        replaces.push({ regExp: regExp4, text: replaceText4 });
        replaces.push({ regExp: regExp5, text: replaceText5 });
        replaces.push({ regExp: regExp6, text: replaceText6 });
        replaces.push({ regExp: regExp7, text: replaceText7 });
        replaces.push({ regExp: regExp8, text: replaceText8 });
    }

    return replaceInFile(filePath, replaces);
}

export async function resolve(tsConfigFilePath: string) {
    if (!endsWith(tsConfigFilePath, ".json")) {
        tsConfigFilePath = path.join(tsConfigFilePath, CONFIG_FILENAME);
    }

    const config: any = await tsconfig.readFile(tsConfigFilePath);
    validateTsConfig(config);

    const outDir = path.resolve(
        path.dirname(tsConfigFilePath),
        config.compilerOptions.outDir
    );

    const jsFiles: string[] = getJSFiles(outDir);
    if (!jsFiles.length) {
        throw new Error("No .js files found");
    }
    const modules = Object.keys(config.compilerOptions.paths);
    await Promise.all(
        jsFiles.map((filePath: string) => {
            const tsModules: ITypescriptModule[] = [];
            for (const moduleName of modules) {
                const modulePath = rtrim(
                    config.compilerOptions.paths[moduleName][0],
                    "*"
                ); // Remove trailing *s
                tsModules.push({ name: moduleName, path: modulePath });
            }
            return getFileReplaceTask(outDir, filePath, tsModules);
        })
    );
}
