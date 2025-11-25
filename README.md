# 和谐历史档案馆 - Banned Historical Archives

[![main](https://github.com/banned-historical-archives/banned-historical-archives.github.io/actions/workflows/build.yml/badge.svg)](https://github.com/banned-historical-archives/banned-historical-archives.github.io/actions/workflows/build.yml)

**Banned Historical Archives - 数字历史档案馆**

[🌐 在线访问 / Live Demo](https://banned-historical-archives.github.io) |
[📖 文档 / Documentation](./docs/) |
[🔧 本地运行 / Local Setup](./docs/local.md) |
[🤝 贡献 / Contribute](./CONTRIBUTING.md)

和谐历史档案馆，[开源](https://github.com/banned-historical-archives/banned-historical-archives.github.io)的数字档案馆。我们致力于搜集、整合各类受官方封禁的文件、报纸、杂志和多媒体资料，对并它们进行标准化处理，通过解析、识别和分类，形成规范化的文档和多媒体档案数据库。

尽管民间有许多人在进行资料收集和校验工作，但分散的工作可能难以避免重复劳动，资料的二次汇编难以确保真实性，且缺少统一的版本管理，难以维护。我们运用一系列自动化工具解决了这些问题，另外支持对每篇文档的溯源。

## 📋 目录 / Table of Contents

- [🚀 快速开始 / Quick Start](#-快速开始--quick-start)
- [📊 数据概览 / Data Overview](#-数据概览--data-overview)
- [🎯 主要功能 / Key Features](#-主要功能--key-features)
- [📁 项目结构 / Project Structure](#-项目结构--project-structure)
- [💻 安装与运行 / Installation & Usage](#-安装与运行--installation--usage)
- [📚 文档 / Documentation](#-文档--documentation)
- [🤝 贡献 / Contributing](#-贡献--contributing)
- [❓ 常见问题 / FAQ](#-常见问题--faq)
- [📄 许可证 / License](#-许可证--license)

## 📊 数据概览 / Data Overview

- **📝 已录入文本**: [至少30万篇](https://github.com/banned-historical-archives/banned-historical-archives.github.io/wiki/%E6%94%B6%E5%BD%95%E7%9A%84%E6%96%87%E7%A8%BF%E5%92%8C%E4%B9%A6%E7%B1%8D)
- **📚 待录入资料**: [超过百万篇](https://huggingface.co/datasets/banned-historical-archives/banned-historical-archives)
- **🎵 多媒体资料**: 音乐、图片、视频等
- **🏷️ 标签系统**: 人物、地点、事件、主题分类

## 🚀 快速开始 / Quick Start

### 在线使用 (最简单)

直接访问 [banned-historical-archives.github.io](https://banned-historical-archives.github.io)

### 本地运行 (推荐)

```bash
# 克隆项目
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io

# 安装依赖
npm install

# 构建网站
npm run build

# 运行服务器
npx serve@latest out
```

访问 `http://localhost:3000`

### Docker 运行

```bash
docker run -d -p 3000:3000 ghcr.io/banned-historical-archives/banned-historical-archives.github.io:latest
```

## 📁 项目结构 / Project Structure

```
banned-historical-archives.github.io/
├── docs/                    # 📚 技术文档 / Technical Documentation
│   ├── local.md            # 本地运行指南 / Local Setup Guide
│   ├── dev.md              # 开发文档 / Development Guide
│   ├── standardization.md  # 数据标准化规范 / Data Standards
│   ├── upload-and-correction.md # 录入校对指南 / Upload & Correction
│   ├── local-search-engine.md # 搜索引擎配置 / Search Engine Setup
│   └── ...
├── backend/                # 🔧 构建脚本 / Build Scripts
├── pages/                  # 🎨 前端页面 / Frontend Pages
├── components/             # 🧩 React 组件 / React Components
├── types/                  # 📝 TypeScript 类型 / TypeScript Types
├── public/                 # 🖼️ 静态资源 / Static Assets
├── out/                    # 🏗️ 构建输出 (静态网站) / Build Output
├── parsed/                 # 📄 解析后数据 / Parsed Data (from repos)
├── config/                 # ⚙️ 配置文件 / Configuration (from repos)
├── json/                   # 📦 JSON 数据 / JSON Data
└── indexes/                # 📇 索引文件 / Index Files
```

### 仓库架构 / Repository Architecture

- **主仓库** (Main): 源代码和前端构建
- **资源仓库** (archives0-31): 原始数据和配置
- **构建产物**: gh-pages (HTML), json (数据), indexes (索引)

## 💻 安装与运行 / Installation & Usage

### 系统要求 / System Requirements

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0
- **Git**: >= 2.0 (可选，用于数据下载)
- **Docker**: (可选，用于容器化部署)

### 安装步骤 / Installation Steps

#### 方式一：本地前端运行 (最简单)

```bash
# 1. 克隆项目
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io

# 2. 安装依赖
npm install

# 3. 构建网站
npm run build

# 4. 启动服务器
npx serve@latest out
```

#### 方式二：完整本地开发环境

```bash
# 1. 克隆项目
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io

# 2. 安装依赖
npm install

# 3. 下载数据 (需要 Git)
npm run init-parsed
npm run init-config

# 4. 构建数据
npm run build-indexes
npm run build-article-json

# 5. 构建网站
npm run build

# 6. 启动服务器
npx serve@latest out
```

#### 方式三：Docker 部署

```bash
# 使用预构建镜像
docker run -d -p 3000:3000 ghcr.io/banned-historical-archives/banned-historical-archives.github.io:latest

# 或使用 Docker Compose (推荐)
docker compose up -d
```

### 开发环境 / Development Environment

```bash
# 安装依赖
npm install

# 启动开发服务器 (热重载)
npm run dev

# 访问 http://localhost:3000
```

## 🎯 主要功能 / Key Features

### 文档系统

- 📄 **文章浏览**: 支持分页、筛选、搜索
- 🔍 **全文检索**: 本地 Elasticsearch 支持
- 📊 **版本对比**: 多来源文档对比
- 🏷️ **智能标签**: 人物、地点、事件标记

### 多媒体系统

- 🎵 **音乐库**: 红色经典歌曲
- 🖼️ **图片库**: 历史照片和档案
- 🎬 **视频库**: 历史纪录片

### 数据质量

- ✅ **标准化**: 统一的文档格式
- 🔗 **可溯源**: 源文件验证
- 📝 **校对记录**: 修改历史追踪

### 官方封禁的原因（包括过去官方公开的文件）
- 自1976年10月6日怀仁堂政变以来，执政党及其统治集团的合法性持续受到质疑。尽管他们编织了无数谎言，事实终将无法掩盖，信息封锁也因此变得不可避免。
- 无产阶级文化大革命时期的历史资料包含了大量对抗特权阶级的斗争经验，对当前官方政权稳定极为不利。
- 许多观点与现行教科书、宣传方向和政策立场存在矛盾。官方甚至修改、编造和美化历史，为防止激起群众好奇心，避免对有争议的历史深入挖掘和讨论。

### 被封禁的资料中揭示的内容
- 以刘少奇和邓小平为首的走资本主义道路的当权派应对建国以后一系列人祸（浮夸风、“三年自然灾害”、一系列政治运动扩大化、文化大革命中绝大多数武斗事件等等）负首要责任。
- “一举粉碎‘四人帮’”事件是冤案。四人帮被捕是因为他们在政治斗争中失利。四人帮在文化大革命中自始至终贯彻了毛泽东的无产阶级革命路线。
- 改革开放是官僚资产阶级为攫取个人利益复辟落后生产关系，变社会主义全民所有制为资本主义所有制的借口。
- 周恩来不是千古完人，他所领导的党内中右集团对于在文化大革命中压制革命路线、迫害各地左派群众也有一份“功劳”；另外，他对我国外交路线的右倾负主要责任。
- 林彪名义上支持文化大革命，支持毛泽东，实质上代表了军内官僚集团，属于右派力量；他的死是与党内其他官僚集团（如周恩来中右集团）和革命司令部斗争的结果（主要是前者起作用）。
- 建国以来，特别是文化大革命以来大量新生事物的涌现为今后革命实践提供了宝贵的经验。

### 评价毛泽东

- 对特权阶级揭露和批判不够彻底，群众并未真正掌握反修正主义的武器，无论是思想上的还是物质上的。无产阶级专政下继续革命的理论无法依靠个人声望维系，随着毛泽东的去世破灭。
- 对群众的信任和依靠不够彻底。文革期间，革委会成员并非通过民主选举产生，而是由[上级指派](https://banned-historical-archives.github.io/articles/883eeb87ad)。所谓的“三结合”（群众代表、干部代表、军队代表的结合）实际上是一种对特权阶级的妥协。人数最多、最具革命精神的造反派群众未能掌握实际权力，反而被干部和军队支持的保守派群众所取代，为文革的失败埋下隐患。
- 在宣传中声称支持巴黎公社，然而实际上却将主张巴黎公社理念的人视为极左分子、无政府主义者或资产阶级反动派。例如：湖南省无联、广东李一哲、湖北北决扬等。对这类群体的压迫给文革造成巨大损失。

### 鉴别真实的历史

**一般方法：** 针对多份资料相互印证的事实（某时某地某人做了什么事），分析事实对各个阶级造成了什么影响，由此得出结论。例：文化大革命中的大量群众运动，注意分析运动发起方与领导方，运动过程事件如何推进（武斗、打砸抢烧等），运动中各方的各种反映，后续如何，最后总结得出事件的性质。
- 分析历史资料中的矛盾以及背后的原因：时间地点人物的矛盾；言行不一的矛盾；对同一事物前后观点的矛盾；
- 深挖争议性话题以及被刻意回避的话题;通常真相与主流宣传相反

## 为什么研究历史

- [为革命而研究历史](https://banned-historical-archives.github.io/articles/e37bedd965)
- [马克思主义者研究历史是为了革命](https://banned-historical-archives.github.io/articles/ab6301b793)

## 安全提醒

为了保护您的隐私与安全，建议您在访问过程中使用翻墙工具。
若需全文检索，可考虑使用本地搜索功能替代。

在使用 GitHub 和 Git 工具时，请谨慎操作，避免在以下操作中泄露个人身份：Issue 发言、Star、Watch、Fork、Pull Request、Git Commit。

建议您使用临时 GitHub 账户，设置随机 ID 和邮箱。

## 全文搜索

### 1. 谷歌搜索

在数据库内上方搜索框搜索即为谷歌搜索，谷歌搜索收到网页收录影响，不保证即时性与搜索效果。

### 2. 本地使用 Elastic Search（推荐、操作略复杂）

**[本地搜索的使用](https://github.com/banned-historical-archives/banned-historical-archives.github.io/blob/master/docs/local-search-engine.md)**

### 3. 本地文本搜索（面向不懂技术的使用者）

下载[此分支](https://github.com/banned-historical-archives/banned-historical-archives.github.io/tree/txt)的[压缩包](https://github.com/banned-historical-archives/banned-historical-archives.github.io/archive/refs/heads/txt.zip)，
安装 VS Code 并使用它打开解压后的目录，在 VS Code 中进行搜索

## 功能

1. 基本的文本、音乐、图片查询功能；
2. 多版本逐字对比、多版本逐行对比和文字原稿对比；
 ![版本对比](https://user-images.githubusercontent.com/109972625/183229751-6e00a481-78a0-4fcc-a203-f73607bdc0c6.jpg)

例如[在扩大的中央工作会议上的讲话](https://banned-historical-archives.github.io/articles/3546cdaf62)这篇文章，点击右上角“对比”按钮，选择“对比不同来源解析后的文本”，可见毛泽东选集官方版本中被删减的内容。

![来源对比](https://banned-historical-archives.github.io/images/comparison_pdf.png)

1. 文件来源对比
2. 歌曲歌词版本对比

## 与其他文库/数据库的区别

- 收录多种来源的文档，可进行版本对比。
- 收录的文档都经过文本识别或者校对并且进行了最细粒度的加工，最大程度保证文本的质量，不仅保留每个段落原有的排版信息，还保留了原有的角标注释信息。非标准化的加工则无法区分文中子标题/子标题日期/段落/引文/注释等信息，无论是正文的版本对比还是其他数据的对比都很困难。
- 可溯源，可验证。所有信息均来自对原始文件（如 pdf）的解析，可以校验原始文件的摘要确保一致。
- 文本识别的模型、训练集、代码，以及解析算法公开透明。
- 包含完整的文档校对记录。

## 📚 文档 / Documentation

### 用户文档 / User Documentation

- [📖 完整文档索引 / Documentation Index](./docs/)
- [🔧 本地运行指南 / Local Setup Guide](./docs/local.md)
- [🔍 搜索功能配置 / Search Engine Setup](./docs/local-search-engine.md)
- [❓ 故障排查 / Troubleshooting](./docs/TROUBLESHOOTING.md)

### 开发者文档 / Developer Documentation

- [⚙️ 架构与开发 / Architecture & Development](./docs/dev.md)
- [📊 数据标准化 / Data Standardization](./docs/standardization.md)
- [📝 录入与校对 / Upload & Correction](./docs/upload-and-correction.md)
- [🔌 API 文档 / API Documentation](./docs/API.md)

### 部署文档 / Deployment Documentation

- [🚀 生产环境部署 / Production Deployment](./docs/DEPLOYMENT.md)
- [🐳 Docker 部署 / Docker Deployment](./docker-compose.yml)
- [🌐 GitHub Pages 部署 / GitHub Pages Deployment](https://github.com/banned-historical-archives/banned-historical-archives.github.io/tree/gh-pages)

## 🤝 贡献 / Contributing

我们欢迎各种形式的贡献！

- [🤝 贡献指南 / Contributing Guide](./CONTRIBUTING.md)
- [🐛 报告问题 / Report Issues](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues)
- [💡 功能请求 / Feature Requests](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues)
- [📝 文档改进 / Documentation Improvements](https://github.com/banned-historical-archives/banned-historical-archives.github.io/wiki)

### 贡献类型 / Types of Contributions

- 📊 **数据贡献**: 提供新的历史资料
- 🔧 **代码贡献**: 改进功能和修复问题
- 📖 **文档贡献**: 完善文档和翻译
- 🎨 **设计贡献**: 改进用户界面和体验

## ❓ 常见问题 / FAQ

### 基本使用 / Basic Usage

**Q: 如何使用这个网站？**
A: 直接访问在线版本 [banned-historical-archives.github.io](https://banned-historical-archives.github.io)，或按照[本地运行指南](./docs/local.md)搭建本地环境。

**Q: 数据来源可靠吗？**
A: 所有数据均注明来源，支持版本对比和溯源验证。平台仅负责数据整理，不对内容真实性做最终判断。

### 技术问题 / Technical Issues

**Q: 本地运行失败怎么办？**
A: 请查看[故障排查指南](./docs/TROUBLESHOOTING.md)或[本地运行指南](./docs/local.md)。

**Q: 如何进行全文搜索？**
A: 推荐使用本地 Elasticsearch 搜索引擎，详见[搜索功能配置](./docs/local-search-engine.md)。

**Q: 数据量很大，下载很慢怎么办？**
A: 可以只下载核心数据（`npm run init-parsed`），或直接使用在线版本。

### 数据相关 / Data Related

**Q: 如何贡献数据？**
A: 请参考[录入与校对指南](./docs/upload-and-correction.md)，在 GitHub Issues 中提交。

**Q: 支持哪些文件格式？**
A: 支持 PDF、图片、EPUB 等常见格式，详见[数据标准化文档](./docs/standardization.md)。

**Q: 如何验证数据真实性？**
A: 每个文档都有来源标注，支持多版本对比，可以通过原始文件摘要验证一致性。

### 安全与隐私 / Security & Privacy

**Q: 使用这个平台安全吗？**
A: 平台代码开源透明。我们建议使用 VPN 访问，并使用临时 GitHub 账户进行操作。

**Q: 为什么要使用临时账户？**
A: 为保护个人隐私，避免在 Git 操作中泄露身份信息。

## 源代码 / Source Code

[\[GitHub\]](https://github.com/banned-historical-archives/banned-historical-archives.github.io)

### 仓库架构说明 / Repository Architecture
- **主仓库**: 当前仓库，包含前端代码和构建脚本
- **资源仓库**: `banned-historical-archives0` 到 `banned-historical-archives31`，存储原始数据
- **分支说明**:
  - `master`: 源代码
  - `gh-pages`: 构建后的静态网站
  - `json`: JSON 格式数据
  - `txt`: 纯文本格式数据

- 如果以备份为目的 fork 本仓库，建议 fork 本仓库对应的资源仓库 banned-historical-archives0, banned-historical-archives1, banned-historical-archives2 ... banned-historical-archives31
- 资源仓库的分支：main 原始文件分支；config 配置文件分支；ocr_cache ocr识别结果(自动生成)；ocr_patch ocr补丁分支；parsed 自动构建的中间文件，用于主仓库的构建；

## 其他

### 静态 html 文件导出

https://github.com/banned-historical-archives/banned-historical-archives.github.io/tree/gh-pages

[zip 压缩包](https://github.com/banned-historical-archives/banned-historical-archives.github.io/archive/refs/heads/gh-pages.zip)

### txt 文件导出

https://github.com/banned-historical-archives/banned-historical-archives.github.io/tree/txt

[zip 压缩包](https://github.com/banned-historical-archives/banned-historical-archives.github.io/archive/refs/heads/txt.zip)

### json 文件导出

https://github.com/banned-historical-archives/banned-historical-archives.github.io/tree/json

[zip 压缩包](https://github.com/banned-historical-archives/banned-historical-archives.github.io/archive/refs/heads/json.zip)

### 原始文件下载

包含已录入的和未录入的原始文件

https://huggingface.co/datasets/banned-historical-archives/banned-historical-archives

## 资料主要来源

- 网友赠送
- 维基解密
- CIA解密资料
- https://jojokanbao.cn
- https://github.com/ProletRevDicta/Prolet
- maoistlegacy https://maoistlegacy.de
- 人民日报数据库 https://huggingface.co/datasets/banned-historical-archives/renminribao
- 文汇报数据库 https://huggingface.co/datasets/banned-historical-archives/wenhuibao_disk
- 文革博物馆 http://museums.cnd.org/CR/
- 文化大革命文献馆 http://geming.20m.com/wenge/wenge.htm
- CCRD 中国当代政治运动史数据库 https://github.com/banned-historical-archives/CCRD
  - 中国文化大革命文库（第三版），包含广西“文革”档案资料（机密）
  - 中国反右运动数据库
  - 中国大跃进-大饥荒数据库
  - 中国五十年代初中期的政治运动数据库：从土地改革到公私合营
- 安娜的档案 https://zh.annas-archive.org/
- 毛泽东博览 http://www.mzdbl.cn
- 中文马克思主义文库 https://www.marxists.org/chinese/index.html
- bannedthought https://bannedthought.net/
- 怀旧金曲立地城 https://ip.lidicity.com/hj/cn/index.html
- 文革照片  https://huggingface.co/datasets/banned-historical-archives/CR-photo  
- 漫画（-1949）  https://huggingface.co/datasets/banned-historical-archives/manhua-before-1949  
- 解放日报  https://huggingface.co/datasets/banned-historical-archives/jiefangribao  
- 新民晚报  https://huggingface.co/datasets/banned-historical-archives/xinminwanbao  
- 画报(-1949)  https://huggingface.co/datasets/banned-historical-archives/huabao-before-1949  
- 人民画报  https://huggingface.co/datasets/banned-historical-archives/renminhuabao  
- 解放军报  https://huggingface.co/datasets/banned-historical-archives/jiefangjunbao  
- 中国妇女  https://huggingface.co/datasets/banned-historical-archives/zhongguofunv  
- 北京周报  https://huggingface.co/datasets/banned-historical-archives/peking-review  
- 杭州日报  https://huggingface.co/datasets/banned-historical-archives/hangzhouribao  
- 新中华报  https://huggingface.co/datasets/banned-historical-archives/xinzhonghuabao  
- 故事会  https://huggingface.co/datasets/banned-historical-archives/gushihui  
- 工农兵画报  https://huggingface.co/datasets/banned-historical-archives/gongnongbinghuabao  
- 炎黄春秋  https://huggingface.co/datasets/banned-historical-archives/yanhuangchunqiu  
- 连环画报  https://huggingface.co/datasets/banned-historical-archives/lianhuanhuabao  
- 中央日报  https://huggingface.co/datasets/banned-historical-archives/zhongyangribao  
- 香港工商晚报  https://huggingface.co/datasets/banned-historical-archives/hkgongshangwanbao  
- 香港大公报  https://huggingface.co/datasets/banned-historical-archives/dagongbao  
- 香港工商日报  https://huggingface.co/datasets/banned-historical-archives/hkgongshangribao  
- 香港华侨日报  https://huggingface.co/datasets/banned-historical-archives/huaqiaoribao  
- 参考消息  https://huggingface.co/datasets/banned-historical-archives/cankaoxiaoxi  
- 裁判文书  https://huggingface.co/datasets/banned-historical-archives/legal-judgements  

## 报刊杂志收录状态

| 名称       | 收录状态 |
| ---------- | -------- |
| 红旗       | 已收录58-76年；77后待录入 |
| 人民日报   | 已精选重要的文章录入 |
| 文汇报   | 已精选重要的文章录入 |
| 解放军报   | 已精选重要的文章录入 |
| 学习与批判 | 部分录入 |
| 自然辩证法 | 已收录 |
| 其他   | 待解析 |

## 收录的文本

[收录的文本](https://github.com/banned-historical-archives/banned-historical-archives.github.io/wiki/%E6%94%B6%E5%BD%95%E7%9A%84%E6%96%87%E6%9C%AC)

## 收录的多媒体资料

[收录的多媒体资料](https://github.com/banned-historical-archives/banned-historical-archives.github.io/wiki/%E6%94%B6%E5%BD%95%E7%9A%84%E5%A4%9A%E5%AA%92%E4%BD%93%E8%B5%84%E6%96%99)

## 📄 许可证 / License

本项目采用 **MIT License** 开源许可证。

### 数据内容声明 / Data Content Disclaimer

- 📚 **内容立场**: 收录资料立场不一，请注意辨别
- ⚖️ **平台立场**: 我们仅进行收录和校对工作，力求保持文档原貌，其内容并不代表我们的观点
- 🔍 **真实性**: 建议通过多方印证来鉴别历史真实性
- 📖 **学习态度**: 鼓励批判性思维，独立分析历史事实

### 使用建议 / Usage Recommendations

- 📖 **学习目的**: 用于历史研究和学术探讨
- 🔒 **隐私保护**: 建议使用 VPN 访问，保护个人隐私
- 🤝 **合规使用**: 请遵守当地法律法规，负责任地使用信息

---

## 🔗 快速链接 / Quick Links

[\[资源贡献\]](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues) |
[本地运行](./docs/local.md) |
[本地搜索](./docs/local-search-engine.md) |
[文本录入与校对](./docs/upload-and-correction.md) |
[标准化加工及开发说明](./docs/standardization.md) |
[故障排查](./docs/TROUBLESHOOTING.md) |
[部署指南](./docs/DEPLOYMENT.md)
