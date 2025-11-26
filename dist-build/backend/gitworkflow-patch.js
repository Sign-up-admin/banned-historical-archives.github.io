"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_article_indexes_1 = require("./get_article_indexes");
const { mkdirSync, existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
/*
const body = `{OCR补丁}
{
  "articleId": "123",
  "publicationId": "xuanji1",
  "patch": {
    "parts": {"a": "..."},
    "comments": {"a": "..."},
    "description": ""
  }
}`
*/
let body = process.env.BODY.trim();
body = body.replace(/^\{OCR补丁\}/, '');
body = body.substr(0, body.lastIndexOf('}') + 1);
let final;
let decoded = '';
const article_indexes = (0, get_article_indexes_1.get_article_indexes)();
try {
    const patch = JSON.parse(body);
    final = {
        ...patch,
        COMMIT_HASH: process.env.COMMIT_HASH,
    };
    decoded = decodeURIComponent(JSON.stringify(final.patch)).replace(/\n/g, '');
    const candidates = article_indexes[patch.articleId];
    const archive_id = candidates.find((i) => i[0] == patch.publicationId)[2];
    console.log('archive_id', archive_id);
    const filepath = join(__dirname, `../ocr_patch/archives${archive_id}/[${final.articleId}][${final.publicationId}].ts`);
    let content = `
export default [
];`;
    if (existsSync(filepath)) {
        content = readFileSync(filepath).toString();
    }
    const idx = content.lastIndexOf(']');
    content =
        content.slice(0, idx) + '  ' + JSON.stringify(final.patch) + ',\n];';
    console.log(filepath, content);
    writeFileSync(filepath, content);
}
catch (e) {
    console.log('error', e);
    process.exit(2);
}
