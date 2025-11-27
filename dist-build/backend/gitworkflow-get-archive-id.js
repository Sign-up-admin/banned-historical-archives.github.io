"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const json5_1 = __importDefault(require("json5"));
const get_article_indexes_1 = require("./get_article_indexes");
const body = process.env.BODY.trim();
const raw_title = process.env.TITLE.trim();
async function start() {
    if (body.startsWith('{OCR补丁}')) {
        let str = body.replace(/^\{OCR补丁\}/, '');
        str = str.substr(0, str.lastIndexOf('}') + 1);
        const obj = json5_1.default.parse(str);
        const a_indexes = (0, get_article_indexes_1.get_article_indexes)();
        const candidates = a_indexes[obj.articleId];
        console.log(candidates.find((i) => i[0] == obj.publicationId)[2]);
        process.exit(0);
    }
    try {
        const body1 = body.substring(0, body.lastIndexOf('```'));
        const body2 = body1.substring(body1.lastIndexOf('```') + 3);
        const config = json5_1.default.parse(body2);
        config.archive_id = config.archive_id == undefined ? 1 : config.archive_id;
        if (config.archive_id >= 0) {
            console.log(config.archive_id);
        }
        else {
            console.log('bad archive id');
            process.exit(3);
        }
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}
if (!process.env.TEST) {
    start();
}
