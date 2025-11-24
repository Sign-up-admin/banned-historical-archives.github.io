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
    execSync(`markdown-link-check "${filePath}" --config .markdown-link-check.json --quiet`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    return true;
  } catch (error) {
    console.error(`Error checking ${filePath}:`, error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
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
    console.error(`\n${failed} file(s) have link issues`);
    process.exit(1);
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

