/**
 * 测试路径解析器
 * 验证能否正确解析 archives0 的数据路径
 */

import { resolveArticlePath, resolveArchiveBasePath, resolveBookMetadataPath } from './backend/archive-path-resolver';

console.log('开始测试路径解析器...\n');

// 设置环境变量（在代码中设置）
process.env['LOCAL_REPO_BASE_PATH'] = 'J:\\banned-historical-archives';
process.env['ARCHIVE_PATH_MAPPING_CONFIG'] = 'config/archive-path-mapping.json';

try {
  // 测试 1: 解析仓库基础路径
  console.log('测试 1: 解析仓库基础路径');
  const archiveBasePath = resolveArchiveBasePath(0);
  console.log(`  archives0 基础路径: ${archiveBasePath}`);

  // 测试 2: 解析书籍元数据路径
  console.log('\n测试 2: 解析书籍元数据路径');
  const bookMetadataPath = resolveBookMetadataPath(0, '0a4');
  console.log(`  书籍 0a4 元数据路径: ${bookMetadataPath}`);

  // 测试 3: 解析文章文件路径
  console.log('\n测试 3: 解析文章文件路径');
  const articlePath = resolveArticlePath(0, '0a4', 'some-article-id');
  console.log(`  文章 some-article-id 路径: ${articlePath}`);

  // 测试 4: 检查路径是否符合预期格式
  console.log('\n测试 4: 验证路径格式');
  const expectedArticlePath = /J:\\banned-historical-archives\\banned-historical-archives0\\mao\\maoquanji27\\[^\\]+\\some-article-id\.json/;
  if (expectedArticlePath.test(articlePath)) {
    console.log('  ✅ 文章路径格式正确');
  } else {
    console.log('  ❌ 文章路径格式正确');
    console.log(`     期望格式: J:\\banned-historical-archives\\banned-historical-archives0\\mao\\maoquanji27\\{prefix}\\some-article-id.json`);
    console.log(`     实际路径: ${articlePath}`);
  }

  console.log('\n🎉 路径解析器测试完成！');

} catch (error: any) {
  console.error('❌ 测试失败:', error.message);
  console.error('错误详情:', error);
  process.exit(1);
}
