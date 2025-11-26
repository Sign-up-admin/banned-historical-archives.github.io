/**
 * @fileoverview Elasticsearch 索引初始化脚本 (独立版本)
 * 
 * 此脚本将解析后的文章数据导入到 Elasticsearch 中，用于提供全文搜索功能。
 * 独立实现，不依赖编译后的文件。
 */

const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { readJSONSync } = require('fs-extra');
const JSON5 = require('json5');

// 加载环境变量
dotenv.config();

// 设置本地仓库路径
const LOCAL_REPO_BASE = process.env['LOCAL_REPO_BASE_PATH'] || 'J:\\banned-historical-archives';

const esClient = new Client({
  node: process.env['ES_URL'] || 'http://localhost:9200',
  requestTimeout: 30000,
  pingTimeout: 3000,
});

/**
 * 加载路径映射配置
 */
function loadPathMappingConfig() {
  const configPath = process.env['ARCHIVE_PATH_MAPPING_CONFIG']
    || join(__dirname, '../config/archive-path-mapping.json');

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    return JSON5.parse(configContent);
  } catch (error) {
    console.warn(`无法加载路径映射配置: ${configPath}`, error);
    return {};
  }
}

/**
 * 解析文章文件路径
 */
function resolveArticlePath(archiveId, bookId, articleId) {
  const config = loadPathMappingConfig();
  const archiveIdStr = String(archiveId);
  const archivePath = config.archive_paths?.[archiveIdStr];
  const dataPattern = config.data_path_patterns?.[archiveIdStr];

  // 如果有本地路径配置，使用映射路径
  if (archivePath && dataPattern) {
    const repoPath = join(LOCAL_REPO_BASE, archivePath);

    // 处理书籍名称映射
    let pattern = dataPattern;
    const bookMapping = config.book_name_mappings?.[archiveIdStr];
    
    // 如果路径模式包含 {book_name}，需要从 book_name_mappings 查找
    if (pattern.includes('{book_name}')) {
      if (bookMapping) {
        const mappedName = bookMapping[bookId] || bookMapping[bookId.slice(0, 3)];
        if (mappedName) {
          pattern = pattern.replace('{book_name}', mappedName);
        } else {
          // 如果没有映射，尝试使用 bookId 本身
          pattern = pattern.replace('{book_name}', bookId);
        }
      } else {
        // 如果没有映射配置，使用 bookId
        pattern = pattern.replace('{book_name}', bookId);
      }
    }

    // 替换路径变量
    pattern = pattern
      .replace(/{book_id}/g, bookId)
      .replace(/{book_prefix}/g, bookId.slice(0, 3))
      .replace(/{article_id}/g, articleId)
      .replace(/{article_prefix}/g, articleId.slice(0, 3));

    return join(repoPath, pattern);
  }

  // 回退到标准路径
  const basePath = process.env['PARSED_DATA_PATH'] || join(__dirname, '../parsed');
  return join(
    basePath,
    'archives' + archiveId,
    bookId.slice(0, 3),
    bookId,
    articleId.slice(0, 3),
    articleId + '.json',
  );
}

/**
 * 获取文章索引数据
 */
function getArticleIndexes() {
  const indexesDir = join(process.cwd(), 'indexes');
  const fileCountPath = join(indexesDir, 'file_count.json');
  
  if (!existsSync(fileCountPath)) {
    throw new Error('索引文件不存在，请先运行: npm run build-indexes');
  }

  const fc = JSON.parse(readFileSync(fileCountPath, 'utf-8'));
  const res = {};

  for (let i = 0; i < fc.article_list; ++i) {
    const partPath = join(indexesDir, `article_list_with_book_info_${i}.json`);
    if (!existsSync(partPath)) {
      continue;
    }
    
    const part = JSON.parse(readFileSync(partPath, 'utf-8'));
    part.forEach((j) => {
      res[j[0]] = j[1];
    });
  }

  return res;
}

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
  
  console.log('🔍 检查 Elasticsearch 连接...');
  try {
    const info = await esClient.info();
    console.log(`✅ 已连接到 Elasticsearch ${info.version.number}`);
  } catch (error) {
    console.error('❌ 无法连接到 Elasticsearch:', error.message);
    console.error('   请确保 Elasticsearch 正在运行: docker compose up -d elasticsearch');
    process.exit(1);
  }

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
          console.log(`✅ 索引不为空 (${countResult.count} 个文档)，跳过初始化`);
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

  console.log('📚 开始初始化 Elasticsearch 索引...');
  
  // 获取文章索引
  let article_indexes;
  try {
    article_indexes = getArticleIndexes();
    console.log(`✅ 已加载 ${Object.keys(article_indexes).length} 篇文章的索引`);
  } catch (error) {
    console.error('❌ 无法加载文章索引:', error.message);
    console.error('   请先运行: npm run build-indexes');
    process.exit(1);
  }

  let processed = 0;
  let errors = 0;
  const total = Object.keys(article_indexes).length;

  console.log(`\n开始导入 ${total} 篇文章...\n`);

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
        console.error(`❌ 处理文章 ${article_id} (book: ${book_id}, archive: ${archive_id}) 时出错:`, error.message);
        errors++;
      }
    }
    
    if (processed % 100 === 0) {
      const progress = ((processed / total) * 100).toFixed(1);
      console.log(`进度: ${processed}/${total} (${progress}%) - 错误: ${errors}`);
    }
  }

  console.log(`\n✅ 初始化完成！`);
  console.log(`   处理: ${processed} 个文档`);
  console.log(`   错误: ${errors} 个`);
  
  // 刷新索引
  await esClient.indices.refresh({ index: 'article' });
  console.log('✅ 索引已刷新');
  
  // 显示统计信息
  const countResult = await esClient.count({ index: 'article' });
  console.log(`✅ 索引中共有 ${countResult.count} 个文档`);
}

// 运行初始化
main().catch((error) => {
  console.error('❌ 初始化失败:', error);
  process.exit(1);
});

