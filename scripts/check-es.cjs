/**
 * @fileoverview Elasticsearch 健康检查和状态验证脚本 (CommonJS 版本)
 * 
 * 此脚本用于检查 Elasticsearch 是否正常运行并已初始化完成。
 */

const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 根据安全配置决定是否使用认证
const esUrl = process.env['ES_URL'] || 'http://localhost:9200';
const esUsername = process.env['ES_USERNAME'] || 'elastic';
const esPassword = process.env['ES_PASSWORD'] || 'password';

const clientConfig = {
  node: esUrl,
  requestTimeout: 30000,
  pingTimeout: 3000,
  // 始终使用认证（Elasticsearch 8.x 默认启用安全）
  auth: {
    username: esUsername,
    password: esPassword,
  },
};

const esClient = new Client(clientConfig);

/**
 * 检查 Elasticsearch 连接
 */
async function checkConnection() {
  try {
    const info = await esClient.info();
    console.log('✅ Elasticsearch 连接成功');
    console.log(`   版本: ${info.version.number}`);
    console.log(`   集群名称: ${info.cluster_name}`);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch 连接失败');
    console.error(`   错误: ${error.message}`);
    return false;
  }
}

/**
 * 检查集群健康状态
 */
async function checkClusterHealth() {
  try {
    const health = await esClient.cluster.health();
    const status = health.status;
    const statusEmoji = status === 'green' ? '✅' : status === 'yellow' ? '⚠️' : '❌';
    
    console.log(`${statusEmoji} 集群健康状态: ${status.toUpperCase()}`);
    console.log(`   节点数: ${health.number_of_nodes}`);
    console.log(`   数据节点数: ${health.number_of_data_nodes}`);
    console.log(`   活动分片: ${health.active_primary_shards}`);
    
    return status !== 'red';
  } catch (error) {
    console.error('❌ 无法获取集群健康状态');
    console.error(`   错误: ${error.message}`);
    return false;
  }
}

/**
 * 检查索引是否存在
 */
async function checkIndex() {
  try {
    const exists = await esClient.indices.exists({ index: 'article' });
    if (exists) {
      console.log('✅ article 索引存在');
      return true;
    } else {
      console.log('⚠️  article 索引不存在');
      return false;
    }
  } catch (error) {
    console.error('❌ 无法检查索引状态');
    console.error(`   错误: ${error.message}`);
    return false;
  }
}

/**
 * 检查索引文档数量
 */
async function checkDocumentCount() {
  try {
    const count = await esClient.count({ index: 'article' });
    const docCount = count.count;
    console.log(`📊 索引文档数量: ${docCount.toLocaleString()}`);
    return docCount;
  } catch (error) {
    if (error.toString().indexOf('index_not_found_exception') >= 0) {
      console.log('📊 索引文档数量: 0 (索引不存在)');
      return 0;
    }
    console.error('❌ 无法获取文档数量');
    console.error(`   错误: ${error.message}`);
    return -1;
  }
}

/**
 * 检查索引统计信息
 */
async function checkIndexStats() {
  try {
    const stats = await esClient.indices.stats({ index: 'article' });
    const indexStats = stats.indices?.article;
    if (indexStats) {
      const storeSize = indexStats.total?.store?.size_in_bytes || 0;
      const storeSizeMB = (storeSize / 1024 / 1024).toFixed(2);
      console.log(`💾 索引大小: ${storeSizeMB} MB`);
    }
  } catch (error) {
    // 忽略错误，不影响主流程
  }
}

/**
 * 主检查函数
 */
async function main() {
  console.log('🔍 开始检查 Elasticsearch 状态...\n');

  // 1. 检查连接
  const connected = await checkConnection();
  if (!connected) {
    console.log('\n❌ Elasticsearch 未运行或无法连接');
    console.log('   请检查：');
    console.log('   1. Elasticsearch 服务是否已启动');
    console.log('   2. 连接地址是否正确 (ES_URL)');
    console.log('   3. 认证信息是否正确 (ES_USERNAME, ES_PASSWORD)');
    process.exit(1);
  }

  console.log('');

  // 2. 检查集群健康
  const healthy = await checkClusterHealth();
  if (!healthy) {
    console.log('\n⚠️  集群状态异常，请检查日志');
  }

  console.log('');

  // 3. 检查索引
  const indexExists = await checkIndex();
  console.log('');

  // 4. 检查文档数量
  const docCount = await checkDocumentCount();
  console.log('');

  // 5. 检查索引统计
  if (indexExists && docCount > 0) {
    await checkIndexStats();
    console.log('');
  }

  // 总结
  console.log('📋 检查总结:');
  if (connected && healthy && indexExists && docCount > 0) {
    console.log('✅ Elasticsearch 已完全初始化并可以正常工作');
    console.log(`✅ 索引已包含 ${docCount.toLocaleString()} 个文档`);
    process.exit(0);
  } else if (connected && healthy && !indexExists) {
    console.log('⚠️  Elasticsearch 运行正常，但索引尚未初始化');
    console.log('   请运行: npm run init-es');
    process.exit(1);
  } else if (connected && healthy && indexExists && docCount === 0) {
    console.log('⚠️  索引已创建，但尚未导入数据');
    console.log('   请运行: npm run init-es');
    process.exit(1);
  } else {
    console.log('❌ Elasticsearch 存在问题，请检查上述错误信息');
    process.exit(1);
  }
}

// 运行检查
main().catch((error) => {
  console.error('❌ 检查过程中发生错误:', error);
  process.exit(1);
});

