"use strict";
/**
 * @fileoverview Elasticsearch 客户端连接配置
 *
 * 此文件配置并导出 Elasticsearch 客户端实例，
 * 用于全文搜索功能。
 *
 * 支持的环境变量：
 * - ES_URL: Elasticsearch 服务地址 (默认: http://localhost:9200)
 * - ES_USERNAME: 认证用户名 (默认: elastic)
 * - ES_PASSWORD: 认证密码 (默认: password)
 *
 * @example
 * ```typescript
 * import esClient from './backend/connect-es';
 *
 * // 执行搜索查询
 * const result = await esClient.search({
 *   index: 'article',
 *   query: { match: { content: '毛泽东' } }
 * });
 * ```
 */
const __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    let desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
const __importStar = (this && this.__importStar) || (function () {
    let ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            const ar = [];
            for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        const result = {};
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore - Elasticsearch types have compatibility issues
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv = __importStar(require("dotenv"));
// 加载环境变量
dotenv.config();
/**
 * Elasticsearch 客户端实例
 *
 * 配置说明：
 * - node: 服务地址，支持环境变量 ES_URL
 * - auth: 基本认证，使用环境变量 ES_USERNAME 和 ES_PASSWORD
 *
 * 默认配置适用于本地 Docker 部署的 Elasticsearch
 */
const esClient = new elasticsearch_1.Client({
    node: process.env['ES_URL'] || 'http://localhost:9200',
    auth: {
        username: process.env['ES_USERNAME'] || 'elastic',
        password: process.env['ES_PASSWORD'] || 'password',
    },
});
/**
 * 默认导出的 Elasticsearch 客户端实例
 * 在整个应用中复用此连接
 */
exports.default = esClient;
