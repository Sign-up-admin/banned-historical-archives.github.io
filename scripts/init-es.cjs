/**
 * @fileoverview Elasticsearch 索引初始化脚本 (CommonJS 版本)
 * 
 * 此脚本将解析后的文章数据导入到 Elasticsearch 中，用于提供全文搜索功能。
 */

const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { readJSONSync } = require('fs-extra');
const { resolveArticlePath } = require('../dist-build/backend/archive-path-resolver');
const { get_article_indexes } = require('../dist-build/backend/get_article_indexes');

// 加载环境变量
dotenv.config();

// 设置本地仓库路径
if (!process.env['LOCAL_REPO_BASE_PATH']) {
  process.env['LOCAL_REPO_BASE_PATH'] = 'J:\\banned-historical-archives';
}

const esClient = new Client({
  node: process.env['ES_URL'] || 'http://localhost:9200',
  requestTimeout: 30000,
  pingTimeout: 3000,
});

/**
 * 等待函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主初始化函数
 */
async function main() {
  const isReset = process.argv[process.argv.length - 1] === 'reset';
  
  if (isReset) {
    // 重置模式：清空现有索引
    try {
      await esClient.deleteByQuery({
        index: 'article',
        body: {
          query: {
            match_all: {},
          },
        },
      });
      console.log('✅ 已清空现有索引');
    } catch (e) {
      console.log('索引不存在或已清空');
    }
  } else {
    // 正常模式：检查索引是否为空
    while (true) {
      try {
        const countResult = await esClient.count({
          index: 'article',
        });
        if (countResult.count != 0) {
          console.log('✅ 索引不为空，跳过初始化');
          return;
        }
        await sleep(1000);
        break;
      } catch (e) {
        if (e.toString().indexOf('index_not_found_exception') >= 0) {
          break;
        }
        console.log('等待 Elasticsearch...');
        await sleep(1000);
      }
    }
  }

  console.log('开始初始化 Elasticsearch 索引...');
  
  // 获取文章索引
  let article_indexes;
  try {
    article_indexes = get_article_indexes();
    console.log(`✅ 已加载 ${Object.keys(article_indexes).length} 篇文章的索引`);
  } catch (error) {
    console.error('❌ 无法加载文章索引，请先运行: npm run build-indexes');
    console.error('错误:', error.message);
    process.exit(1);
  }

  let processed = 0;
  let errors = 0;
  const total = Object.keys(article_indexes).length;

  // 遍历所有文章
  for (const article_id of Object.keys(article_indexes)) {
    for (const book of article_indexes[article_id]) {
      const [book_id, book_name, archive_id] = book;
      
      try {
        // 解析文章路径
        const articlePath = resolveArticlePath(
          archive_id,
          book_id,
          article_id,
        );

        if (!existsSync(articlePath)) {
          console.warn(`⚠️  文件不存在: ${articlePath}`);
          errors++;
          continue;
        }

        // 读取文章数据
        const article = readJSONSync(articlePath);
        
        // 构建 Elasticsearch 文档
        const es_article = {
          article_id,
          publication_id: book_id,
          publication_name: book_name,
          authors: article.authors || [],
          title: article.title || '',
          aliases: [],
          content: [
            article.description || '',
            ...(article.parts || []).map(j => j.text || '').filter(Boolean),
            ...(article.comments || []).filter(Boolean),
          ].join('\n'),
        };

        // 索引到 Elasticsearch
        await esClient.index({
          index: 'article',
          id: `${article_id}-${book_id}`,
          document: es_article,
        });

        processed++;
      } catch (error) {
        console.error(`❌ 处理文章 ${article_id} (book: ${book_id}) 时出错:`, error.message);
        errors++;
      }
    }
    
    if (processed % 100 === 0) {
      console.log(`进度: ${processed}/${total} (错误: ${errors})`);
    }
  }

  console.log(`\n✅ 初始化完成！`);
  console.log(`   处理: ${processed} 个文档`);
  console.log(`   错误: ${errors} 个`);
  
  // 刷新索引
  await esClient.indices.refresh({ index: 'article' });
  console.log('✅ 索引已刷新');
}

// 运行初始化
main().catch((error) => {
  console.error('❌ 初始化失败:', error);
  process.exit(1);
});

