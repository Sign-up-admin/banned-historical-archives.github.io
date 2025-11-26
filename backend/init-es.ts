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

import 'reflect-metadata';

import esClient from './connect-es';
import { ArticleIndexes, ParserResult } from '../types';
import { readFileSync } from 'fs';
import { join } from 'path';
import { readJSONSync } from 'fs-extra';
import { resolveArticlePath } from './archive-path-resolver';
import { sleep } from '../utils';
import { get_article_indexes } from './get_article_indexes';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 获取解析数据的基础路径
 * 支持通过环境变量 PARSED_DATA_PATH 自定义路径
 * 如果未设置，则使用默认的相对路径
 */
function getParsedDataPath(): string {
  if (process.env['PARSED_DATA_PATH']) {
    return process.env['PARSED_DATA_PATH'];
  }
  return join(__dirname, '../parsed');
}

/**
 * Elasticsearch 文章文档类型
 * 定义存储在 Elasticsearch 中的文章数据结构
 */
type ESArticle = {
  /** 文章唯一标识 */
  article_id: string;
  /** 出版物 ID */
  publication_id: string;
  /** 出版物名称 */
  publication_name: string;
  /** 文章标题 */
  title: string;
  /** 标题别名列表 */
  aliases: string[];
  /** 作者列表 */
  authors: string[];
  /** 文章全文内容 */
  content: string;
};

/**
 * 获取文章索引数据
 * 从构建的索引文件中读取文章基本信息
 */
const article_indexes = get_article_indexes();

(async () => {
  if (process.argv[process.argv.length - 1] === 'reset') {
    // 清空
    try {
      await esClient.deleteByQuery({
        index: 'article',
        body: {
          query: {
            match_all: {},
          },
        },
      });
    } catch (e) {}
  } else {
    while (true) {
      try {
        const countResult = await esClient.count({
          index: 'article',
        });
        if (countResult.count != 0) {
          console.log('article not empty');
          return;
        }
        await sleep(1000);
        break;
      } catch (e: any) {
        if (e.toString().indexOf('index_not_found_exception') >= 0) {
          break;
        }
        console.log(e);
        await sleep(1000);
      }
    }
  }

  const es_articles: ESArticle[] = [];
  let t = 0;

  const total = Object.keys(article_indexes).length;
  for (const article_id of Object.keys(article_indexes)) {
    for (const book of article_indexes[article_id]) {
      const [book_id, book_name, archive_id] = book;
      const article = readJSONSync(
        resolveArticlePath(
          archive_id,
          book_id,
          article_id,
        ),
      ) as ParserResult;
      const es_article: ESArticle = {
        article_id,
        publication_id: book[0],
        publication_name: book[1],
        authors: article.authors,
        title: article.title,
        aliases: [],
        content:
          article.description +
          article.parts.map((j) => j.text).join('\n') +
          article.comments.map((j) => j).join('\n'),
      };
      es_articles.push(es_article);
      await esClient.index({
        index: 'article',
        id: `${article_id}-${book_id}`,
        document: es_article,
      });
    }
    console.log(`${++t}/${total}`);
  }
})();
