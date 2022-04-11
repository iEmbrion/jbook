"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const local_api_1 = require("@jsxnotes/local-api");
const isProduction = process.env.NODE_ENV === 'production';
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p --port <number>', 'port to run server on', '4005')
    .action((filename = 'notebook.js', options) => __awaiter(void 0, void 0, void 0, function* () {
    //cwd = current working directory (absolute path)
    //dirname = directory name (e.g. notes/notebook.js returns notes)
    //basename = filename (e.g. notes/notebook.js returns notebook.js)
    try {
        const dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename));
        console.log(`DIR: ${dir}`);
        yield (0, local_api_1.serve)(parseInt(options.port), filename, dir, !isProduction);
        console.log(`Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`);
    }
    catch (err) {
        if (err.code === 'EDDRINUSE')
            console.error(`Port is in use. Try running on a different port.`);
        else
            console.log(`Here is the problem: ${err.message}`);
        process.exit(1);
    }
}));
