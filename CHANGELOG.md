# 更新日志 / Changelog

本文档记录了「和谐历史档案馆」项目的版本更新历史，按照时间倒序列出所有重要的变更。

This document records the version update history of the "Banned Historical Archives" project, listing all important changes in reverse chronological order.

## [Unreleased]

### 新增功能 / Added

- 完善项目文档体系，添加多语言支持
- 新增文档索引页面 (`docs/README.md`)
- 为所有关键组件和类型添加详细注释
- 改进本地开发环境配置和故障排查指南

### 改进 / Changed

- 重构文档结构，按用户角色分类组织
- 优化 README.md，添加快速开始和项目结构说明
- 完善本地运行指南，包含详细的故障排查步骤
- 改进数据 API 文档，增加使用示例

### 修复 / Fixed

- 修复文档中的链接错误
- 统一文档格式和术语使用
- 改进代码注释质量和一致性

## [1.0.0] - 2024-01-01

### 新增功能 / Added

- 初始版本发布
- 支持文档、音乐、图片三种内容类型
- 实现本地全文搜索引擎 (Elasticsearch)
- 支持文章编辑和版本控制
- 多语言界面支持

### 技术栈 / Technical

- 前端：Next.js + React + Material-UI
- 后端：Node.js + TypeScript
- 搜索引擎：Elasticsearch
- 数据存储：GitHub Raw Content API

---

## 版本格式说明 / Version Format Description

本项目使用 [语义化版本控制](https://semver.org/) (Semantic Versioning)：

- **MAJOR.MINOR.PATCH** (主要版本.次要版本.补丁版本)
- **MAJOR**: 破坏性变更 / Breaking changes
- **MINOR**: 新功能，向后兼容 / New features, backward compatible
- **PATCH**: 修复，向后兼容 / Bug fixes, backward compatible

## 变更类型 / Change Types

- **新增功能 / Added**: 新功能
- **改进 / Changed**: 现有功能的改进
- **废弃 / Deprecated**: 即将移除的功能
- **移除 / Removed**: 已移除的功能
- **修复 / Fixed**: 错误修复
- **安全 / Security**: 安全相关的变更

## 贡献 / Contributing

### 如何记录变更 / How to Record Changes

1. **新增功能**: 在 `[Unreleased]` 部分的 `### 新增功能 / Added` 下添加
2. **改进**: 在 `[Unreleased]` 部分的 `### 改进 / Changed` 下添加
3. **修复**: 在 `[Unreleased]` 部分的 `### 修复 / Fixed` 下添加
4. **破坏性变更**: 在 `[Unreleased]` 部分的 `### 破坏性变更 / Breaking` 下添加

### 发布新版本 / Release Process

1. 将 `[Unreleased]` 部分重命名为具体版本号，如 `[1.1.0] - 2024-02-01`
2. 在顶部添加新的 `[Unreleased]` 部分
3. 更新版本号相关的文件
4. 创建 Git tag 并推送

### 示例 / Examples

```markdown
## [1.1.0] - 2024-02-01

### 新增功能 / Added
- 添加用户认证系统
- 支持暗色主题切换

### 改进 / Changed
- 优化首页加载性能
- 改进移动端响应式布局

### 修复 / Fixed
- 修复搜索结果分页错误
- 解决图片懒加载问题

### 破坏性变更 / Breaking
- 移除对 IE11 的支持
```

## 历史版本 / Historical Versions

- [查看所有版本](https://github.com/banned-historical-archives/banned-historical-archives.github.io/releases)
- [提交历史](https://github.com/banned-historical-archives/banned-historical-archives.github.io/commits/main)

---

**维护者 / Maintainers**: 项目贡献者 / Project Contributors
**最后更新 / Last Updated**: 2025-11-23
