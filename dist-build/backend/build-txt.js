"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const posix_1 = require("node:path/posix");
const fs_1 = __importStar(require("fs"));
const archive_path_resolver_1 = require("./archive-path-resolver");
const fs_extra_1 = require("fs-extra");
const get_article_indexes_1 = require("./get_article_indexes");
/*
  const temp = {
    id: 'xxxx',
    pages: [
      {
        articleId: 'xxxx',
        comment: [
          {
            part_index: 1,
            offset: 1,
            text: 'xxxx'
          }
        ],
        content: [
          {
            type: 'xxxx',
            text: 'xxxx'
          }
        ]
      }
    ]
  }
  */
const article_indexes = (0, get_article_indexes_1.get_article_indexes)();
Object.keys(article_indexes).forEach((article_id) => {
    for (const book of article_indexes[article_id]) {
        const book_id = book[0];
        const archives_id = 'archives' + book[2];
        const book_metadata = JSON.parse(fs_1.default
            .readFileSync((0, archive_path_resolver_1.resolveBookMetadataPath)(parseInt(book[2]), book_id))
            .toString());
        if (book_metadata.lyrics)
            continue;
        const article = JSON.parse(fs_1.default
            .readFileSync((0, archive_path_resolver_1.resolveArticlePath)(parseInt(book[2]), book_id, article_id))
            .toString());
        const tags = JSON.parse(fs_1.default
            .readFileSync((0, archive_path_resolver_1.resolveArticlePath)(parseInt(book[2]), book_id, article_id).replace('.json', '.tags'))
            .toString());
        const content = `id: ${article_id}
标题：${article.title}
日期：${article.dates
            .map((j) => `${j.year || 0}-${j.month || 0}-${j.day || 0}`)
            .join(',')}
是否是时间段：${article.is_range_date}
作者：${article.authors.join(',')}
来源：${article.origin || ''}
标签：${tags?.map((i) => i.name).join(',') || ''}
书籍：${book_metadata.name}
书籍作者：${book_metadata.author}

正文：
${article.parts
            .map((j) => {
            if (j.type === 'title')
                return `# ${j.text}`;
            else if (j.type === 'subtitle')
                return `## ${j.text}`;
            else if (j.type === 'subtitle2')
                return `### ${j.text}`;
            else if (j.type === 'subtitle3')
                return `#### ${j.text}`;
            else if (j.type === 'quotation')
                return `> ${j.text}`;
            else
                return j.text;
        })
            .join('\n\n')}

描述：
${article.description || ''}
`;
        (0, fs_extra_1.ensureDirSync)((0, posix_1.join)(__dirname, '../txt', book_id, article_id.slice(0, 3)));
        (0, fs_1.writeFileSync)((0, posix_1.join)(__dirname, '../txt', book_id, article_id.slice(0, 3), `${article_id}.txt`), content);
    }
});
