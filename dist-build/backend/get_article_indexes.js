"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_article_indexes = get_article_indexes;
const fs_1 = require("fs");
const path_1 = require("path");
function get_article_indexes() {
    const fc = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'indexes', 'file_count.json')).toString());
    const res = {};
    for (let i = 0; i < fc.article_list; ++i) {
        const part = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'indexes', 'article_list_with_book_info_' + i + '.json')).toString());
        part.forEach((j) => {
            res[j[0]] = j[1];
        });
    }
    return res;
}
