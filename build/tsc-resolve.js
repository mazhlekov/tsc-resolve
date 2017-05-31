"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = require("path");
var tsconfig = require("tsconfig");
var utils_1 = require("./utils");
function getFileReplaceTask(outDir, filePath, modules) {
    var replaces = [];
    for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
        var module_1 = modules_1[_i];
        var moduleDir = path.resolve(outDir, module_1.path);
        var diff = path.relative(path.resolve(moduleDir, path.dirname(filePath)), moduleDir);
        diff = utils_1.convertToUnixPath(diff);
        if (!(diff.lastIndexOf(".", 0) === 0)) {
            diff = "./" + diff;
        }
        var regExp1 = new RegExp(utils_1.escapeRegExp("require(\"" + module_1.name + "\")"), "g");
        var replaceText1 = "require(\"" + diff + "\")";
        var regExp2 = new RegExp(utils_1.escapeRegExp("require(\"" + module_1.name + "/"), "g");
        var replaceText2 = "require(\"" + diff;
        if (diff !== "./") {
            replaceText2 += "/";
        }
        replaces.push({ regExp: regExp1, text: replaceText1 });
        replaces.push({ regExp: regExp2, text: replaceText2 });
    }
    return utils_1.replaceInFile(filePath, replaces);
}
function resolve(tsConfigFilePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var config, outDir, jsFiles, modules;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!utils_1.endsWith(tsConfigFilePath, ".json")) {
                        tsConfigFilePath = path.join(tsConfigFilePath, utils_1.CONFIG_FILENAME);
                    }
                    return [4 /*yield*/, tsconfig.readFile(tsConfigFilePath)];
                case 1:
                    config = _a.sent();
                    utils_1.validateTsConfig(config);
                    outDir = path.resolve(path.dirname(tsConfigFilePath), config.compilerOptions.outDir);
                    jsFiles = utils_1.getJSFiles(outDir);
                    if (!jsFiles.length) {
                        throw new Error("No .js files found");
                    }
                    modules = Object.keys(config.compilerOptions.paths);
                    return [4 /*yield*/, Promise.all(jsFiles.map(function (filePath) {
                            var tsModules = [];
                            for (var _i = 0, modules_2 = modules; _i < modules_2.length; _i++) {
                                var moduleName = modules_2[_i];
                                var modulePath = utils_1.rtrim(config.compilerOptions.paths[moduleName][0], "*"); // Remove trailing *s
                                tsModules.push({ name: moduleName, path: modulePath });
                            }
                            return getFileReplaceTask(outDir, filePath, tsModules);
                        }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.resolve = resolve;
