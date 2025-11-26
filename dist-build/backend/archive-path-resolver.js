"use strict";
/**
 * @fileoverview 仓库路径解析器
 *
 * 支持本地仓库路径映射，兼容项目原有的配置机制
 * 参考: backend/init-sub-repository.ts 的 REPO_PREFIX 机制
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
exports.resolveArticlePath = resolveArticlePath;
exports.resolveArchiveBasePath = resolveArchiveBasePath;
exports.resolveBookMetadataPath = resolveBookMetadataPath;
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv = __importStar(require("dotenv"));
const json5_1 = __importDefault(require("json5"));
dotenv.config();
let configCache = null;
/**
 * 加载路径映射配置
 * 参考: backend/init-sub-repository.ts 的配置加载方式
 */
function loadPathMappingConfig() {
    if (configCache) {
        return configCache;
    }
    const configPath = process.env['ARCHIVE_PATH_MAPPING_CONFIG']
        || (0, path_1.join)(__dirname, '../config/archive-path-mapping.json');
    if (!(0, fs_1.existsSync)(configPath)) {
        return {};
    }
    try {
        const configContent = (0, fs_1.readFileSync)(configPath, 'utf-8');
        configCache = json5_1.default.parse(configContent);
        return configCache;
    }
    catch (error) {
        console.warn(`无法加载路径映射配置: ${configPath}`, error);
        return {};
    }
}
/**
 * 解析文章文件路径
 * 参考: backend/init-es.ts 的 getParsedDataPath() 函数
 */
function resolveArticlePath(archiveId, bookId, articleId) {
    const config = loadPathMappingConfig();
    const archiveIdStr = String(archiveId);
    // 检查是否有本地仓库路径配置
    const localRepoBase = process.env['LOCAL_REPO_BASE_PATH'];
    const archivePath = config.archive_paths?.[archiveIdStr];
    const dataPattern = config.data_path_patterns?.[archiveIdStr];
    // 如果有本地路径配置，使用映射路径
    if (localRepoBase && archivePath && dataPattern) {
        const repoPath = (0, path_1.join)(localRepoBase, archivePath);
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
        return (0, path_1.join)(repoPath, pattern, articleId + '.json');
    }
    // 回退到标准路径（参考 backend/init-es.ts）
    const basePath = process.env['PARSED_DATA_PATH']
        || (0, path_1.join)(__dirname, '../parsed');
    return (0, path_1.join)(basePath, 'archives' + archiveId, bookId.slice(0, 3), bookId, articleId.slice(0, 3), articleId + '.json');
}
/**
 * 解析仓库基础路径
 * 参考: backend/build-indexes.ts 的路径构建方式
 */
function resolveArchiveBasePath(archiveId) {
    const config = loadPathMappingConfig();
    const archiveIdStr = String(archiveId);
    const localRepoBase = process.env['LOCAL_REPO_BASE_PATH'];
    const archivePath = config.archive_paths?.[archiveIdStr];
    if (localRepoBase && archivePath) {
        return (0, path_1.join)(localRepoBase, archivePath);
    }
    // 回退到标准路径
    const basePath = process.env['PARSED_DATA_PATH']
        || (0, path_1.join)(__dirname, '../parsed');
    return (0, path_1.join)(basePath, 'archives' + archiveId);
}
/**
 * 解析书籍元数据文件路径
 * 参考: backend/build-article-json.ts 的路径构建方式
 */
function resolveBookMetadataPath(archiveId, bookId) {
    const config = loadPathMappingConfig();
    const archiveIdStr = String(archiveId);
    // 检查是否有本地仓库路径配置
    const localRepoBase = process.env['LOCAL_REPO_BASE_PATH'];
    const archivePath = config.archive_paths?.[archiveIdStr];
    const dataPattern = config.data_path_patterns?.[archiveIdStr];
    // 如果有本地路径配置，使用映射路径
    if (localRepoBase && archivePath && dataPattern) {
        const repoPath = (0, path_1.join)(localRepoBase, archivePath);
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
        return (0, path_1.join)(repoPath, pattern, bookId, `${bookId}.metadata`);
    }
    // 回退到标准路径
    const basePath = process.env['PARSED_DATA_PATH']
        || (0, path_1.join)(__dirname, '../parsed');
    return (0, path_1.join)(basePath, 'archives' + archiveId, bookId.slice(0, 3), bookId, `${bookId}.metadata`);
}
