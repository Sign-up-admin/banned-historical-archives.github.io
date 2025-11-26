/**
 * @fileoverview 仓库路径解析器
 *
 * 支持本地仓库路径映射，兼容项目原有的配置机制
 * 参考: backend/init-sub-repository.ts 的 REPO_PREFIX 机制
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
import JSON5 from 'json5';

dotenv.config();

interface PathMappingConfig {
  archive_paths?: Record<string, string>;
  data_path_patterns?: Record<string, string>;
  book_name_mappings?: Record<string, Record<string, string>>;
}

let configCache: PathMappingConfig | null = null;

/**
 * 加载路径映射配置
 * 参考: backend/init-sub-repository.ts 的配置加载方式
 */
function loadPathMappingConfig(): PathMappingConfig {
  if (configCache) {
    return configCache;
  }

  const configPath = process.env['ARCHIVE_PATH_MAPPING_CONFIG']
    || join(__dirname, '../config/archive-path-mapping.json');

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    configCache = JSON5.parse(configContent);
    return configCache!;
  } catch (error) {
    console.warn(`无法加载路径映射配置: ${configPath}`, error);
    return {};
  }
}

/**
 * 解析文章文件路径
 * 参考: backend/init-es.ts 的 getParsedDataPath() 函数
 */
export function resolveArticlePath(
  archiveId: number,
  bookId: string,
  articleId: string,
): string {
  const config = loadPathMappingConfig();
  const archiveIdStr = String(archiveId);

  // 检查是否有本地仓库路径配置
  const localRepoBase = process.env['LOCAL_REPO_BASE_PATH'];
  const archivePath = config.archive_paths?.[archiveIdStr];
  const dataPattern = config.data_path_patterns?.[archiveIdStr];

  // 如果有本地路径配置，使用映射路径
  if (localRepoBase && archivePath && dataPattern) {
    const repoPath = join(localRepoBase, archivePath);

    // 处理书籍名称映射
    let pattern = dataPattern;
    const bookMapping = config.book_name_mappings?.[archiveIdStr];
    if (bookMapping) {
      const mappedName = bookMapping[bookId] || bookMapping[bookId.slice(0, 3)];
      if (mappedName) {
        pattern = pattern.replace('{book_name}', mappedName);
      }
    }

    // 替换路径变量
    pattern = pattern
      .replace('{book_id}', bookId)
      .replace('{book_prefix}', bookId.slice(0, 3))
      .replace('{article_id}', articleId)
      .replace('{article_prefix}', articleId.slice(0, 3));

    return join(repoPath, pattern, articleId + '.json');
  }

  // 回退到标准路径（参考 backend/init-es.ts）
  const basePath = process.env['PARSED_DATA_PATH']
    || join(__dirname, '../parsed');
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
 * 解析仓库基础路径
 * 参考: backend/build-indexes.ts 的路径构建方式
 */
export function resolveArchiveBasePath(archiveId: number): string {
  const config = loadPathMappingConfig();
  const archiveIdStr = String(archiveId);

  const localRepoBase = process.env['LOCAL_REPO_BASE_PATH'];
  const archivePath = config.archive_paths?.[archiveIdStr];

  if (localRepoBase && archivePath) {
    return join(localRepoBase, archivePath);
  }

  // 回退到标准路径
  const basePath = process.env['PARSED_DATA_PATH']
    || join(__dirname, '../parsed');
  return join(basePath, 'archives' + archiveId);
}

/**
 * 解析书籍元数据文件路径
 * 参考: backend/build-article-json.ts 的路径构建方式
 */
export function resolveBookMetadataPath(
  archiveId: number,
  bookId: string,
): string {
  const config = loadPathMappingConfig();
  const archiveIdStr = String(archiveId);

  // 检查是否有本地仓库路径配置
  const localRepoBase = process.env['LOCAL_REPO_BASE_PATH'];
  const archivePath = config.archive_paths?.[archiveIdStr];
  const dataPattern = config.data_path_patterns?.[archiveIdStr];

  // 如果有本地路径配置，使用映射路径
  if (localRepoBase && archivePath && dataPattern) {
    const repoPath = join(localRepoBase, archivePath);

    // 处理书籍名称映射
    let pattern = dataPattern;
    const bookMapping = config.book_name_mappings?.[archiveIdStr];
    if (bookMapping) {
      const mappedName = bookMapping[bookId] || bookMapping[bookId.slice(0, 3)];
      if (mappedName) {
        pattern = pattern.replace('{book_name}', mappedName);
      }
    }

    // 替换路径变量
    pattern = pattern
      .replace('{book_id}', bookId)
      .replace('{book_prefix}', bookId.slice(0, 3));

    return join(repoPath, pattern, bookId, `${bookId}.metadata`);
  }

  // 回退到标准路径
  const basePath = process.env['PARSED_DATA_PATH']
    || join(__dirname, '../parsed');
  return join(
    basePath,
    'archives' + archiveId,
    bookId.slice(0, 3),
    bookId,
    `${bookId}.metadata`,
  );
}
