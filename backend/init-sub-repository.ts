/**
 * @fileoverview 子仓库数据初始化脚本
 *
 * 此脚本用于从 GitHub 下载项目所需的资源仓库数据，
 * 包括解析后的数据、配置文件等。
 *
 * 支持的数据分支：
 * - parsed: 解析后的标准化数据
 * - config: 配置文件和元数据
 * - raw: 原始文件数据
 * - ocr_cache: OCR 识别缓存
 * - ocr_patch: OCR 结果补丁
 *
 * @example
 * ```bash
 * # 下载解析数据
 * npm run init-parsed
 *
 * # 下载配置文件
 * npm run init-config
 *
 * # 下载原始文件
 * npm run init-raw
 * ```
 */

import { execSync } from 'child_process';
import { join } from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * GitHub 仓库前缀
 * 可以通过 REPO_PREFIX 环境变量自定义
 *
 * @default 'https://github.com/banned-historical-archives'
 */
const prefix = process.env['REPO_PREFIX'] || 'https://github.com/banned-historical-archives';

/**
 * 获取命令行参数中的分支名称
 * 这是脚本的入口点参数
 */
let branch = process.argv[process.argv.length - 1];

/**
 * 目标目录名，与分支名相同
 */
const dir = branch;

/**
 * 转换分支名称
 * raw 分支在 GitHub 上使用 main 分支名
 */
branch = branch === 'raw' ? 'main' : branch;

/**
 * 批量下载资源仓库数据
 *
 * 此脚本会循环下载 banned-historical-archives0 到 banned-historical-archives31
 * 的指定分支数据到本地对应目录。
 *
 * 下载策略：
 * 1. 使用浅克隆 (--depth 1) 提高速度
 * 2. 如果目录已存在，尝试更新到最新版本
 * 3. 出错时记录日志但不中断整个流程
 */
for (let i = 0; i <= 31; ++i) {
  // 构建 Git 克隆命令
  const command = `(git clone --depth 1 --branch ${branch} ${prefix}/banned-historical-archives${i}.git ${dir}/archives${i}) || true`;

  console.log(`执行命令: ${command}`);

  try {
    // 执行克隆命令
    execSync(command, { cwd: join(__dirname, '..') });

    // 如果目录已存在，尝试更新
    const repoPath = join(__dirname, '../', dir, 'archives' + i);

    try {
      // 重置到最新状态
      execSync('(git reset --hard) || true', { cwd: repoPath });

      // 拉取最新更改
      execSync('(git pull) || true', { cwd: repoPath });

      // 确保在正确的分支上
      execSync(`(git checkout ${branch}) || true`, { cwd: repoPath });

      console.log(`仓库 archives${i} 更新完成`);
    } catch (updateError) {
      console.log(`仓库 archives${i} 更新失败:`, updateError);
    }
  } catch (cloneError) {
    console.log(`仓库 archives${i} 克隆失败:`, cloneError);
  }
}

console.log('所有仓库数据下载完成');
