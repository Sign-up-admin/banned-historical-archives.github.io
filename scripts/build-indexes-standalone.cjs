/**
 * @fileoverview 构建文章索引脚本 (独立版本)
 * 
 * 从三个数据仓库扫描文章文件并构建索引
 */

const { readFileSync, existsSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const { readdirSync, statSync } = require('fs');
const JSON5 = require('json5');

const LOCAL_REPO_BASE = process.env['LOCAL_REPO_BASE_PATH'] || 'J:\\banned-historical-archives';

/**
 * 加载路径映射配置
 */
function loadPathMappingConfig() {
  const configPath = join(__dirname, '../config/archive-path-mapping.json');
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
 * 递归扫描目录获取所有 JSON 文件
 */
function scanJsonFiles(dir, archiveId, bookId, bookName, files = []) {
  if (!existsSync(dir)) {
    return files;
  }

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // 递归扫描子目录
        scanJsonFiles(fullPath, archiveId, bookId, bookName, files);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        // 提取文章 ID（文件名去掉 .json）
        const articleId = entry.name.replace('.json', '');
        
        // 尝试读取文件获取标题和作者
        try {
          const articleData = JSON.parse(readFileSync(fullPath, 'utf-8'));
          files.push({
            articleId,
            bookId,
            bookName,
            archiveId,
            title: articleData.title || '',
            authors: articleData.authors || [],
          });
        } catch (e) {
          // 如果读取失败，仍然记录文件
          files.push({
            articleId,
            bookId,
            bookName,
            archiveId,
            title: '',
            authors: [],
          });
        }
      }
    }
  } catch (error) {
    console.warn(`扫描目录失败: ${dir}`, error.message);
  }

  return files;
}

/**
 * 扫描仓库
 */
function scanArchive(archiveId, archivePath) {
  console.log(`\n扫描仓库 ${archiveId}: ${archivePath}`);
  
  const repoPath = join(LOCAL_REPO_BASE, archivePath);
  if (!existsSync(repoPath)) {
    console.warn(`⚠️  仓库路径不存在: ${repoPath}`);
    return [];
  }

  const config = loadPathMappingConfig();
  const dataPattern = config.data_path_patterns?.[String(archiveId)];
  
  if (!dataPattern) {
    console.warn(`⚠️  未找到仓库 ${archiveId} 的路径模式配置`);
    return [];
  }

  const allFiles = [];
  
  // 根据路径模式扫描
  if (dataPattern.includes('{book_name}')) {
    // banned-historical-archives0: mao/{book_name}/{article_prefix}/{article_id}.json
    const maoPath = join(repoPath, 'mao');
    if (existsSync(maoPath)) {
      const bookDirs = readdirSync(maoPath, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name);
      
      for (const bookName of bookDirs) {
        const bookPath = join(maoPath, bookName);
        const files = scanJsonFiles(bookPath, archiveId, bookName, bookName);
        allFiles.push(...files);
      }
    }
  } else {
    // banned-historical-archives1/2: {book_prefix}/{book_id}/{article_prefix}/{article_id}.json
    const topDirs = readdirSync(repoPath, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);
    
    for (const bookPrefix of topDirs) {
      const prefixPath = join(repoPath, bookPrefix);
      const bookDirs = readdirSync(prefixPath, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name);
      
      for (const bookId of bookDirs) {
        const bookPath = join(prefixPath, bookId);
        const files = scanJsonFiles(bookPath, archiveId, bookId, bookId);
        allFiles.push(...files);
      }
    }
  }

  console.log(`  ✅ 找到 ${allFiles.length} 个文章文件`);
  return allFiles;
}

/**
 * 主函数
 */
function main() {
  console.log('📚 开始构建文章索引...');
  console.log(`仓库基础路径: ${LOCAL_REPO_BASE}`);

  const config = loadPathMappingConfig();
  const archivePaths = config.archive_paths || {};
  
  // 收集所有文章
  const articleMap = new Map(); // articleId -> [bookInfo, ...]
  
  // 扫描所有配置的仓库
  for (const [archiveId, archivePath] of Object.entries(archivePaths)) {
    const files = scanArchive(archiveId, archivePath);
    
    for (const file of files) {
      const key = file.articleId;
      if (!articleMap.has(key)) {
        articleMap.set(key, []);
      }
      articleMap.get(key).push([
        file.bookId,
        file.bookName,
        parseInt(archiveId),
      ]);
    }
  }

  console.log(`\n✅ 共找到 ${articleMap.size} 篇唯一文章`);

  // 创建索引目录
  const indexesDir = join(__dirname, '../indexes');
  if (!existsSync(indexesDir)) {
    mkdirSync(indexesDir, { recursive: true });
  }

  // 将文章索引分组（每1000个一组）
  const articles = Array.from(articleMap.entries());
  const chunkSize = 1000;
  const chunks = [];
  
  for (let i = 0; i < articles.length; i += chunkSize) {
    chunks.push(articles.slice(i, i + chunkSize));
  }

  // 写入文件计数
  writeFileSync(
    join(indexesDir, 'file_count.json'),
    JSON.stringify({ article_list: chunks.length }, null, 2)
  );

  // 写入每个分块
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].map(([articleId, books]) => [articleId, books]);
    writeFileSync(
      join(indexesDir, `article_list_with_book_info_${i}.json`),
      JSON.stringify(chunk, null, 2)
    );
  }

  console.log(`\n✅ 索引构建完成！`);
  console.log(`   文章数: ${articleMap.size}`);
  console.log(`   分块数: ${chunks.length}`);
  console.log(`   索引目录: ${indexesDir}`);
}

main();

