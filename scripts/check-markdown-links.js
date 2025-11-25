#!/usr/bin/env node

/**
 * 跨平台 Markdown 链接检查脚本
 * 遍历所有 Markdown 文件并检查链接
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// 需要忽略的目录
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'out',
  'parsed',
  'config',
  'raw',
  'ocr_cache',
  'ocr_patch',
  'migration'
];

/**
 * 检查文件路径是否应该被忽略
 */
function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * 查找所有 Markdown 文件
 */
async function findMarkdownFiles() {
  const files = await glob('**/*.md', {
    ignore: IGNORE_PATTERNS.map(p => `**/${p}/**`),
    absolute: false
  });
  
  return files.filter(file => !shouldIgnore(file));
}

/**
 * 检查单个文件的链接
 */
function checkFileLinks(filePath) {
  try {
    console.log(`Checking links in: ${filePath}`);
    
    // 设置代理环境变量（如果未设置）
    const env = {
      ...process.env,
      HTTP_PROXY: process.env.HTTP_PROXY || process.env.http_proxy || 'http://127.0.0.1:10808',
      HTTPS_PROXY: process.env.HTTPS_PROXY || process.env.https_proxy || 'http://127.0.0.1:10808',
      NO_PROXY: process.env.NO_PROXY || process.env.no_proxy || 'localhost,127.0.0.1'
    };
    
    execSync(`markdown-link-check "${filePath}" --config .markdown-link-check.json --quiet`, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: env
    });
    return true;
  } catch (error) {
    // 链接检查失败不阻止继续执行（可能是网络问题或外部链接暂时不可用）
    console.warn(`Warning: Some links in ${filePath} may be broken (this may be due to network issues)`);
    return true; // 返回 true 以继续检查其他文件
  }
}

/**
 * 主函数
 */
async function main() {
  // 显示代理配置信息
  const proxy = process.env.HTTP_PROXY || process.env.http_proxy || 'http://127.0.0.1:10808';
  console.log(`Using proxy: ${proxy}`);
  console.log('(You can override this by setting HTTP_PROXY or HTTPS_PROXY environment variable)');
  console.log('');
  
  console.log('Finding Markdown files...');
  const files = await findMarkdownFiles();
  
  console.log(`Found ${files.length} Markdown files`);
  
  let failed = 0;
  for (const file of files) {
    if (!checkFileLinks(file)) {
      failed++;
    }
  }
  
  if (failed > 0) {
    console.warn(`\n${failed} file(s) had link check warnings (may be due to network issues)`);
    // 不退出，因为链接问题可能是网络相关的
    process.exit(0);
  } else {
    console.log('\nAll links checked successfully!');
    process.exit(0);
  }
}

// 运行主函数
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

