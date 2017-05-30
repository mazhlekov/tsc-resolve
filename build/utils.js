"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Bluebird = require("bluebird");
var path = require("path");
var gracefulFs = require("graceful-fs");
var fs = Bluebird.promisifyAll(gracefulFs.gracefulify(require("fs")));
exports.CONFIG_FILENAME = "tsconfig.json";
function getJSFiles(dir, files) {
    if (files === void 0) { files = []; }
    for (var _i = 0, _a = fs.readdirSync(dir); _i < _a.length; _i++) {
        var file = _a[_i];
        var fileName = path.join(dir, file);
        if (fs.statSync(fileName).isDirectory()) {
            getJSFiles(fileName, files);
        }
        else {
            var fileExt = fileName.split(".").pop();
            if (fileExt === "js") {
                files.push(fileName);
            }
        }
    }
    return files;
}
exports.getJSFiles = getJSFiles;
function replaceInFile(filePath, replaces) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var newSource, _i, replaces_1, replace;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFileAsync(filePath, "utf-8")];
                case 1:
                    newSource = _a.sent();
                    for (_i = 0, replaces_1 = replaces; _i < replaces_1.length; _i++) {
                        replace = replaces_1[_i];
                        newSource = newSource.replace(replace.regExp, replace.text);
                    }
                    return [4 /*yield*/, fs.writeFileAsync(filePath, newSource, "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.replaceInFile = replaceInFile;
function getCwdConfig() {
    return path.resolve(process.cwd(), exports.CONFIG_FILENAME);
}
exports.getCwdConfig = getCwdConfig;
function rtrim(str, char) {
    if (str.slice(str.length - char.length) === char) {
        return rtrim(str.slice(0, 0 - char.length), char);
    }
    else {
        return str;
    }
}
exports.rtrim = rtrim;
function escapeRegExp(expr) {
    if (typeof expr !== "string") {
        throw new TypeError("Expected a string");
    }
    return expr.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
exports.escapeRegExp = escapeRegExp;
function convertToUnixPath(path) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(path);
    var hasNonAscii = /[^\x00-\x80]+/.test(path);
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }
    return path.replace(/\\/g, "/");
}
exports.convertToUnixPath = convertToUnixPath;
function validateTsConfig(config) {
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
    for (var module_1 in config.compilerOptions.paths) {
        if (config.compilerOptions.paths[module_1].length > 1) {
            throw new Error("You cannot have more than one path per module. \"" + module_1 + "\" is invalid => " + config.compilerOptions.paths[module_1]);
        }
    }
}
exports.validateTsConfig = validateTsConfig;
