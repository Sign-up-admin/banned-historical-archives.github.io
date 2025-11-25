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

// @ts-ignore - Elasticsearch types have compatibility issues
import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';

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
const esClient = new Client({
  node: process.env['ES_URL'] || 'http://localhost:9200',
  auth: {
    username: process.env['ES_USERNAME']! || 'elastic',
    password: process.env['ES_PASSWORD']! || 'password',
  },
});

/**
 * 默认导出的 Elasticsearch 客户端实例
 * 在整个应用中复用此连接
 */
export default esClient;
