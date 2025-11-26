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

import { ensureDirSync, readFile, readFileSync } from 'fs-extra';
import { join } from 'path';
import { ArticleIndexesWithBookInfo } from '../types';
import { writeFileSync } from 'fs';
import { get_article_indexes } from './get_article_indexes';
import { resolveArticlePath, resolveBookMetadataPath } from './archive-path-resolver';

/**
 * 获取所有文章的索引信息
 * 包含文章 ID 与出版物信息的映射关系
 */
const article_indexes = get_article_indexes();

/**
 * 主构建函数
 *
 * 为每篇文章生成完整的 JSON 数据文件，
 * 包含该文章在所有出版物中的版本信息。
 */
(async () => {
  console.log('开始构建文章 JSON 数据...');

  // 输出目录
  const root = join(process.cwd(), 'json');
  ensureDirSync(root);

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
      const bookMetadataPath = resolveBookMetadataPath(
        archives_id,
        book_id,
      );
      const bookMetadata = JSON.parse(
        (await readFile(bookMetadataPath)).toString(),
      );

      // 读取文章内容
      const articlePath = resolveArticlePath(
        archives_id,
        book_id,
        article_id,
      );
      bookMetadata.article = JSON.parse(
        (await readFile(articlePath)).toString(),
      );

      // 读取文章标签
      const tagsPath = articlePath.replace('.json', '.tags');
      bookMetadata.tags = JSON.parse(
        (await readFile(tagsPath)).toString(),
      );

      books.push(bookMetadata);
    }

    // 创建输出目录（按文章 ID 前3位分组）
    const outputDir = join(root, article_id.slice(0, 3));
    ensureDirSync(outputDir);

    // 写入 JSON 文件
    const outputPath = join(outputDir, article_id + '.json');
    writeFileSync(
      outputPath,
      JSON.stringify({
        books,
      }),
    );

    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`已处理 ${processedCount}/${totalArticles} 篇文章`);
    }
  }

  console.log(`构建完成，共处理 ${totalArticles} 篇文章`);
})();
