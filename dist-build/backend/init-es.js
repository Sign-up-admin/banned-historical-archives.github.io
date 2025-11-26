"use strict";
/**
 * @fileoverview Elasticsearch 索引初始化脚本
 *
 * 此脚本将解析后的文章数据导入到 Elasticsearch 中，
 * 用于提供全文搜索功能。
 *
 * 支持两种模式：
 * - 正常模式：检查索引是否为空，只在空索引时导入
 * - 重置模式：清空现有索引并重新导入所有数据
 *
 * @example
 * ```bash
 * # 初始化索引（只在空索引时导入）
 * npm run init-es
 *
 * # 重置并重新初始化索引
 * npm run init-es reset
 *
 * # 查看导入进度
 * tail -f /dev/null &
 * ```
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const connect_es_1 = __importDefault(require("./connect-es"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const archive_path_resolver_1 = require("./archive-path-resolver");
const utils_1 = require("../utils");
const get_article_indexes_1 = require("./get_article_indexes");
const dotenv = __importStar(require("dotenv"));
// 加载环境变量
dotenv.config();
/**
 * 获取解析数据的基础路径
 * 支持通过环境变量 PARSED_DATA_PATH 自定义路径
 * 如果未设置，则使用默认的相对路径
 */
function getParsedDataPath() {
    if (process.env['PARSED_DATA_PATH']) {
        return process.env['PARSED_DATA_PATH'];
    }
    return (0, path_1.join)(__dirname, '../parsed');
}
/**
 * 获取文章索引数据
 * 从构建的索引文件中读取文章基本信息
 */
const article_indexes = (0, get_article_indexes_1.get_article_indexes)();
(async () => {
    if (process.argv[process.argv.length - 1] === 'reset') {
        // 清空
        try {
            await connect_es_1.default.deleteByQuery({
                index: 'article',
                body: {
                    query: {
                        match_all: {},
                    },
                },
            });
        }
        catch (e) { }
    }
    else {
        while (true) {
            try {
                const countResult = await connect_es_1.default.count({
                    index: 'article',
                });
                if (countResult.count != 0) {
                    console.log('article not empty');
                    return;
                }
                await (0, utils_1.sleep)(1000);
                break;
            }
            catch (e) {
                if (e.toString().indexOf('index_not_found_exception') >= 0) {
                    break;
                }
                console.log(e);
                await (0, utils_1.sleep)(1000);
            }
        }
    }
    const es_articles = [];
    let t = 0;
    const total = Object.keys(article_indexes).length;
    for (const article_id of Object.keys(article_indexes)) {
        for (const book of article_indexes[article_id]) {
            const [book_id, book_name, archive_id] = book;
            const article = (0, fs_extra_1.readJSONSync)((0, archive_path_resolver_1.resolveArticlePath)(parseInt(archive_id), book_id, article_id));
            const es_article = {
                article_id,
                publication_id: book[0],
                publication_name: book[1],
                authors: article.authors,
                title: article.title,
                aliases: [],
                content: article.description +
                    article.parts.map((j) => j.text).join('\n') +
                    article.comments.map((j) => j).join('\n'),
            };
            es_articles.push(es_article);
            await connect_es_1.default.index({
                index: 'article',
                id: `${article_id}-${book_id}`,
                document: es_article,
            });
        }
        console.log(`${++t}/${total}`);
    }
})();
