# 需求变更日志 / Requirements Changelog

## 文档概述 / Document Overview

本文档记录和谐历史档案馆项目需求文档的变更历史，包括需求的新增、修改、删除和状态变更。

This document records the change history of requirements documents for the "Banned Historical Archives" project, including additions, modifications, deletions, and status changes of requirements.

## 变更记录格式 / Change Log Format

每条变更记录包含以下信息：

- **日期**: 变更日期
- **需求ID**: 受影响的需求标识符
- **变更类型**: 新增/修改/删除/状态变更
- **变更描述**: 详细的变更内容
- **影响分析**: 变更对系统的影响
- **相关文档**: 相关的需求文档

## 2025年1月 - 需求文档完善 / January 2025 - Requirements Documentation Enhancement

### 新增需求 / New Requirements

#### FR8: OCR补丁预览功能 / OCR Patch Preview Feature

- **日期**: 2025-01-XX
- **需求ID**: FR8.1, FR8.2
- **变更类型**: 新增
- **变更描述**:
  - FR8.1: 添加OCR补丁应用功能需求，支持V2补丁格式，创建虚拟预览版本
  - FR8.2: 添加补丁导入功能需求，支持从外部导入OCR补丁代码
- **影响分析**:
  - 新增补丁应用算法需求
  - 新增预览版本管理需求
  - 影响文章详情页面功能
- **相关文档**: FRD.md, SRS.md, REQUIREMENTS_TRACEABILITY.md
- **实现状态**: ✅ 已实现

#### FR9: PDF预览功能 / PDF Preview Feature

- **日期**: 2025-01-XX
- **需求ID**: FR9.1, FR9.2
- **变更类型**: 新增
- **变更描述**:
  - FR9.1: 添加PDF文档预览功能需求，支持PDF.js渲染和缩放控制
  - FR9.2: 添加图片预览功能需求
- **影响分析**:
  - 新增PDF渲染库依赖
  - 影响文章详情页面功能
- **相关文档**: FRD.md, SRS.md, REQUIREMENTS_TRACEABILITY.md
- **实现状态**: ✅ 已实现

### 需求增强 / Requirements Enhancement

#### FR2.2: 版本对比功能增强 / Version Comparison Enhancement

- **日期**: 2025-01-XX
- **需求ID**: FR2.2
- **变更类型**: 增强
- **变更描述**:
  - 完善版本对比功能的详细描述
  - 添加多种对比模式：逐字对比、逐行对比、描述和注释对比
  - 添加对比类型：无对比、原始版本对比、校对后版本对比、版本间对比
  - 补充实现细节（使用diff-match-patch库）
- **影响分析**:
  - 不影响现有实现
  - 完善了功能描述，提高可理解性
- **相关文档**: FRD.md, URD.md
- **实现状态**: ✅ 已实现

#### FR6: 数据筛选系统增强 / Data Filtering System Enhancement

- **日期**: 2025-01-XX
- **需求ID**: FR6.1-6.5
- **变更类型**: 增强
- **变更描述**:
  - 添加详细的筛选交互流程
  - 补充筛选逻辑说明（日期范围判断、多条件组合）
  - 添加FR6.5筛选组合与交互需求
- **影响分析**:
  - 完善了筛选功能的描述
  - 提高了需求的可测试性
- **相关文档**: FRD.md, URD.md
- **实现状态**: ✅ 已实现

### 用户需求新增 / New User Requirements

#### 用户故事新增 / New User Stories

- **日期**: 2025-01-XX
- **变更类型**: 新增
- **新增用户故事**:
  - US-HR-005: PDF原始文档验证
  - US-HR-006: 多版本深度对比
  - US-DC-004: OCR补丁预览和校对
  - US-DC-005: 批量数据校对
- **影响分析**: 丰富了用户需求场景，提高了需求完整性
- **相关文档**: URD.md, REQUIREMENTS_TRACEABILITY.md
- **实现状态**: ✅ 已实现

#### 用户旅程地图新增 / New User Journey Maps

- **日期**: 2025-01-XX
- **变更类型**: 新增
- **新增旅程地图**:
  - 旅程1: 历史研究者深度研究旅程
  - 旅程2: 数据贡献者校对工作旅程
  - 旅程3: 普通访客探索旅程
- **影响分析**: 提供了更详细的用户体验设计指导
- **相关文档**: URD.md
- **实现状态**: ✅ 已实现

### 非功能需求增强 / Non-Functional Requirements Enhancement

#### 数据备份和恢复需求 / Backup and Recovery Requirements

- **日期**: 2025-01-XX
- **需求ID**: BRR1-BRR3
- **变更类型**: 新增
- **变更描述**:
  - BRR1: 数据备份策略（备份频率、备份内容、备份存储）
  - BRR2: 数据恢复策略（恢复流程、RTO、RPO）
  - BRR3: 灾难恢复（灾难场景、恢复测试）
- **影响分析**:
  - 新增运维需求
  - 提高系统可靠性
- **相关文档**: NFR.md
- **实现状态**: 📋 计划中

#### 可扩展性规划 / Scalability Planning

- **日期**: 2025-01-XX
- **需求ID**: SP1-SP2
- **变更类型**: 新增
- **变更描述**:
  - SP1: 数据增长规划（当前数据规模、扩展策略）
  - SP2: 性能优化规划（前端优化、后端优化）
- **影响分析**:
  - 为未来扩展提供指导
  - 提高系统可扩展性
- **相关文档**: NFR.md
- **实现状态**: 📋 计划中

### 文档结构改进 / Documentation Structure Improvements

#### 需求追踪矩阵创建 / Requirements Traceability Matrix Creation

- **日期**: 2025-01-XX
- **变更类型**: 新增文档
- **变更描述**: 创建REQUIREMENTS_TRACEABILITY.md文档，建立需求与代码实现的映射关系
- **影响分析**:
  - 提高了需求可追踪性
  - 便于需求验证和管理
- **相关文档**: REQUIREMENTS_TRACEABILITY.md
- **实现状态**: ✅ 已完成

#### 文档交叉引用完善 / Cross-Reference Enhancement

- **日期**: 2025-01-XX
- **变更类型**: 改进
- **变更描述**: 在所有需求文档中添加交叉引用，建立文档间的关联关系
- **影响分析**:
  - 提高了文档的可导航性
  - 便于查找相关信息
- **相关文档**: FRD.md, URD.md, NFR.md, SRS.md
- **实现状态**: ✅ 已完成

#### 需求依赖关系图添加 / Requirements Dependency Diagram Addition

- **日期**: 2025-01-XX
- **变更类型**: 新增
- **变更描述**: 在SRS.md中添加需求依赖关系图，展示需求之间的依赖关系
- **影响分析**:
  - 清晰展示需求依赖关系
  - 便于需求优先级规划
- **相关文档**: SRS.md
- **实现状态**: ✅ 已完成

## 2024年11月 - 需求文档初始版本 / November 2024 - Initial Requirements Documentation

### 初始需求文档创建 / Initial Requirements Documents Creation

- **日期**: 2024-11-24
- **变更类型**: 新增
- **变更描述**: 创建初始需求文档集合
  - FRD.md: 功能需求文档（49个章节）
  - URD.md: 用户需求文档（49个章节）
  - NFR.md: 非功能需求文档（73个章节）
  - SRS.md: 系统需求规格说明（91个章节）
- **影响分析**: 建立了完整的需求文档体系
- **相关文档**: FRD.md, URD.md, NFR.md, SRS.md
- **实现状态**: ✅ 已完成

## 需求状态变更 / Requirements Status Changes

### 2025年1月状态更新 / January 2025 Status Update

| 需求ID | 原状态 | 新状态 | 变更原因 |
|--------|--------|--------|----------|
| FR8.1 | 📋 计划中 | ✅ 已实现 | 功能已完整实现 |
| FR8.2 | 📋 计划中 | ✅ 已实现 | 代码导入功能已实现 |
| FR9.1 | 📋 计划中 | ✅ 已实现 | PDF预览功能已实现 |
| FR9.2 | 📋 计划中 | ✅ 已实现 | 图片预览功能已实现 |
| FR2.2 | ✅ 已实现 | ✅ 已实现（增强） | 功能描述完善 |

## 需求优先级调整 / Requirements Priority Adjustments

### 2025年1月优先级调整 / January 2025 Priority Adjustments

| 需求ID | 原优先级 | 新优先级 | 调整原因 |
|--------|----------|----------|----------|
| FR8.1 | P3 | P2 | 功能已实现，提升优先级 |
| FR9.1 | P3 | P2 | 功能已实现，提升优先级 |

## 需求删除记录 / Requirements Deletion Records

目前无需求删除记录。

Currently no requirements have been deleted.

## 需求文档版本历史 / Requirements Documents Version History

| 文档 | 版本 | 日期 | 主要变更 |
|------|------|------|----------|
| FRD.md | 1.0 | 2024-11-24 | 初始版本 |
| FRD.md | 2.0 | 2025-01 | 补充实际实现功能，添加用例场景 |
| URD.md | 1.0 | 2024-11-24 | 初始版本 |
| URD.md | 2.0 | 2025-01 | 添加用户旅程地图，补充用户故事 |
| NFR.md | 1.0 | 2024-11-24 | 初始版本 |
| NFR.md | 2.0 | 2025-01 | 补充量化指标，添加备份恢复需求 |
| SRS.md | 1.0 | 2024-11-24 | 初始版本 |
| SRS.md | 2.0 | 2025-01 | 更新架构描述，添加API规格 |
| REQUIREMENTS_TRACEABILITY.md | 1.0 | 2025-01 | 新建文档 |

## 未来计划 / Future Plans

### 计划中的需求变更 / Planned Requirements Changes

#### 数据录入功能完善 / Data Entry Feature Enhancement

- **计划日期**: 2025年Q2
- **需求ID**: FR7.1, FR7.2
- **计划内容**: 完善数据录入和校对功能的前端界面
- **预期影响**: 提高数据贡献者的工作效率

#### 音乐播放功能增强 / Music Playback Feature Enhancement

- **计划日期**: 2025年Q2
- **需求ID**: FR3.2
- **计划内容**: 完善音乐播放功能，添加高级播放控制
- **预期影响**: 提升用户体验

#### 图库筛选功能增强 / Gallery Filtering Feature Enhancement

- **计划日期**: 2025年Q2
- **需求ID**: FR4.1
- **计划内容**: 添加图库的高级筛选功能
- **预期影响**: 提高图库浏览效率

## 变更统计 / Change Statistics

### 2025年1月变更统计 / January 2025 Change Statistics

- **新增需求**: 4个（FR8.1, FR8.2, FR9.1, FR9.2）
- **增强需求**: 2个（FR2.2, FR6系列）
- **新增用户故事**: 4个
- **新增用户旅程**: 3个
- **新增非功能需求**: 2个章节（备份恢复、可扩展性）
- **文档创建**: 2个（REQUIREMENTS_TRACEABILITY.md, CHANGELOG.md）
- **文档更新**: 4个（FRD, URD, NFR, SRS）

### 总体统计 / Overall Statistics

- **功能需求总数**: 25个
- **用户故事总数**: 15个
- **需求文档总数**: 5个
- **需求追踪覆盖率**: 100%

---

**文档版本**: 1.0
**最后更新**: 2025年1月
**维护者**: 需求管理团队
**更新频率**: 每次需求变更后及时更新
