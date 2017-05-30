#!/usr/bin/env node
"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = require("path");
var Bluebird = require("bluebird");
global.Promise = Bluebird; // only for CLI usage
var yargs = require("yargs");
var utils_1 = require("./utils");
var tsc_resolve_1 = require("./tsc-resolve");
var USAGE = "\nUSAGE:\n    tsc-resolve\n    tsc-resolve -p tsconfig.prod.json\n    tsc-resolve -p ./conf/tsconfig.dev.json\n    tsc-resolve -p ./conf/\n    tsc-resolve -p ../\n";
var argv = yargs
    .usage(USAGE)
    .option("p", {
    alias: "project",
    default: "./tsconfig.json",
    global: false,
    description: "[FILE OR DIRECTORY]",
    type: "string",
    normalize: true,
})
    .help()
    .epilogue("GitHub repository at http://github.com/mazhlekov/tsc-resolve")
    .argv;
var tsConfigPath = utils_1.getCwdConfig();
if (argv.p) {
    if (argv.p.endsWith(".json")) {
        tsConfigPath = path.resolve(process.cwd(), argv.p);
    }
    else {
        tsConfigPath = path.resolve(process.cwd(), argv.p, utils_1.CONFIG_FILENAME);
    }
}
(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, tsc_resolve_1.resolve(tsConfigPath)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
