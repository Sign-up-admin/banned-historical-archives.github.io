"use strict";
/**
 * @fileoverview 文章 JSON 数据构建脚本
 *
 * 此脚本将解析后的文章数据按照出版物分组，
 * 生成前端可直接使用的 JSON 数据文件。
 *
 * 处理流程：
 * 1. 读取文章索引，获取所有文章的基本信息
 * 2. 为每篇文章收集其在不同出版物中的版本
 * 3. 合并元数据、文章内容和标签信息
 * 4. 生成按文章 ID 组织的 JSON 文件
 *
 * 输出格式：json/{前3位ID}/{完整ID}.json
 *
 * @example
 * ```bash
 * # 构建文章 JSON 数据
 * npm run build-article-json
 *
 * # 查看构建结果
 * ls -la json/ | head -10
 *
 * # 查看单个文章数据
 * cat json/883/883eeb87ad.json | jq '.books[0].article.title'
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const fs_1 = require("fs");
const get_article_indexes_1 = require("./get_article_indexes");
const archive_path_resolver_1 = require("./archive-path-resolver");
/**
 * 获取所有文章的索引信息
 * 包含文章 ID 与出版物信息的映射关系
 */
const article_indexes = (0, get_article_indexes_1.get_article_indexes)();
/**
 * 主构建函数
 *
 * 为每篇文章生成完整的 JSON 数据文件，
 * 包含该文章在所有出版物中的版本信息。
 */
(async () => {
    console.log('开始构建文章 JSON 数据...');
    // 输出目录
    const root = (0, path_1.join)(process.cwd(), 'json');
    (0, fs_extra_1.ensureDirSync)(root);
    const totalArticles = Object.keys(article_indexes).length;
    let processedCount = 0;
    // 遍历所有文章
    for (const article_id of Object.keys(article_indexes)) {
        const book_arr = article_indexes[article_id];
        const books = [];
        // 为每篇文章收集其在不同出版物中的版本
        for (const bookInfo of book_arr) {
            const [book_id, book_name, archives_id] = bookInfo;
            // 读取书籍元数据
            const bookMetadataPath = (0, archive_path_resolver_1.resolveBookMetadataPath)(parseInt(archives_id), book_id);
            const bookMetadata = JSON.parse((await (0, fs_extra_1.readFile)(bookMetadataPath)).toString());
            // 读取文章内容
            const articlePath = (0, archive_path_resolver_1.resolveArticlePath)(parseInt(archives_id), book_id, article_id);
            bookMetadata.article = JSON.parse((await (0, fs_extra_1.readFile)(articlePath)).toString());
            // 读取文章标签
            const tagsPath = articlePath.replace('.json', '.tags');
            bookMetadata.tags = JSON.parse((await (0, fs_extra_1.readFile)(tagsPath)).toString());
            books.push(bookMetadata);
        }
        // 创建输出目录（按文章 ID 前3位分组）
        const outputDir = (0, path_1.join)(root, article_id.slice(0, 3));
        (0, fs_extra_1.ensureDirSync)(outputDir);
        // 写入 JSON 文件
        const outputPath = (0, path_1.join)(outputDir, article_id + '.json');
        (0, fs_1.writeFileSync)(outputPath, JSON.stringify({
            books,
        }));
        processedCount++;
        if (processedCount % 100 === 0) {
            console.log(`已处理 ${processedCount}/${totalArticles} 篇文章`);
        }
    }
    console.log(`构建完成，共处理 ${totalArticles} 篇文章`);
})();
