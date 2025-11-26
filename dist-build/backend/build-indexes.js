"use strict";
/**
 * @fileoverview 索引构建脚本
 *
 * 此脚本扫描所有解析后的数据，构建用于前端快速查询的索引文件。
 * 索引文件存储在 indexes/ 目录下，分片存储以提高加载性能。
 *
 * 生成的索引文件：
 * - file_count.json: 文件统计信息
 * - article_list_{n}.json: 文章列表分片
 * - article_list_with_book_info_{n}.json: 文章与书籍关联信息
 * - music.json: 音乐资源索引
 * - gallery.json: 图库资源索引
 *
 * @example
 * ```bash
 * # 构建所有索引
 * npm run build-indexes
 *
 * # 查看构建结果
 * ls -la indexes/
 * ```
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const json5_1 = __importDefault(require("json5"));
const archive_path_resolver_1 = require("./archive-path-resolver");
/**
 * 全局变量：存储各类资源索引
 */
const gallery_indexes = []; // 图库索引
const music_indexes = []; // 音乐索引
const article_map = {}; // 文章映射
/**
 * 将文章映射转换为列表格式
 *
 * @param c - 文章映射对象
 * @returns 文章列表数组
 */
function article_map_to_list(c) {
    return Object.keys(c).map((i) => {
        const a = c[i];
        return {
            id: i,
            ...a,
        };
    });
}
/**
 * 主构建函数
 *
 * 扫描所有解析后的数据目录，构建完整的索引文件。
 * 处理流程：
 * 1. 遍历所有资源仓库 (archives0-31)
 * 2. 读取每个资源的元数据和配置
 * 3. 根据资源类型构建对应的索引
 * 4. 生成分片存储的索引文件
 *
 * @example
 * ```bash
 * # 执行构建
 * npm run build-indexes
 *
 * # 查看构建进度
 * tail -f /dev/null &
 * ```
 */
(async () => {
    console.log('开始构建索引文件...');
    // 遍历所有资源仓库 (0-31)
    for (let i = 0; i <= 31; ++i) {
        const archivePath = (0, archive_path_resolver_1.resolveArchiveBasePath)(i);
        console.log(`处理仓库: ${archivePath}`);
        // 检查仓库目录是否存在
        if (!(await fs_extra_1.default.pathExists(archivePath))) {
            console.log(`仓库 ${i} 不存在，跳过`);
            continue;
        }
        // 遍历仓库中的所有资源目录
        // 目录结构: parsed/archives{i}/{prefix}/{resource}/
        for (const prefix of (await fs_extra_1.default.readdir(archivePath)).filter((item) => !item.startsWith('.') && !item.endsWith('.md'))) {
            const prefixPath = (0, path_1.join)(archivePath, prefix);
            for (const resource of await fs_extra_1.default.readdir(prefixPath)) {
                console.log(`处理资源: ${resource} (仓库 ${i})`);
                const resourcePath = (0, path_1.join)(prefixPath, resource);
                const flist = await fs_extra_1.default.readdir(resourcePath);
                // 读取资源元数据
                const metadataPath = (0, path_1.join)(resourcePath, resource + '.metadata');
                const metadata = JSON.parse((await fs_extra_1.default.readFile(metadataPath)).toString());
                // 读取资源配置
                const configPath = (0, path_1.join)(__dirname, `../config/archives${i}/${metadata.id}.ts`);
                const configContent = (await fs_extra_1.default.readFile(configPath)).toString()
                    .replace('export default', '') // 移除 ES6 导出语法
                    .replace(/\;\s*$/, ''); // 移除末尾分号
                const cfg = json5_1.default.parse(configContent);
                if (cfg.resource_type === 'music') {
                    const music_metadata = metadata;
                    music_indexes.push([
                        metadata.id,
                        metadata.name,
                        i,
                        music_metadata.lyrics.length,
                        music_metadata.tags || [],
                        music_metadata.composers,
                        Array.from(music_metadata.lyrics.reduce((m, i) => {
                            i.lyricists.forEach((x) => m.add(x));
                            return m;
                        }, new Set())),
                        Array.from(music_metadata.lyrics.reduce((m, i) => {
                            for (const x of i.audios) {
                                for (const y of x.artists) {
                                    m.add(y.name + '&' + y.type);
                                }
                            }
                            return m;
                        }, new Set())).map((i) => ({ name: i.split('&')[0], type: i.split('&')[1] })),
                        Array.from(music_metadata.lyrics.reduce((m, i) => {
                            for (const x of i.audios) {
                                for (const y of x.sources) {
                                    m.add(y);
                                }
                            }
                            return m;
                        }, new Set())),
                        Array.from(music_metadata.lyrics.reduce((m, i) => {
                            for (const x of i.audios) {
                                for (const j of x.art_forms)
                                    m.add(j);
                            }
                            return m;
                        }, new Set())),
                    ]);
                }
                else if (cfg.resource_type === 'video') {
                    gallery_indexes.push(metadata);
                }
                else if (cfg.resource_type === 'picture') {
                    gallery_indexes.push(metadata);
                }
                else if (cfg.resource_type === 'book') {
                    const bookMetaData = metadata;
                    const prefix2_list = flist.filter((x) => !x.endsWith('.metadata'));
                    for (const prefix2 of prefix2_list) {
                        for (const article_file of (await fs_extra_1.default.readdir((0, path_1.join)(archivePath, prefix, resource, prefix2))).filter((x) => x.endsWith('.json'))) {
                            const article_id = (0, path_1.parse)(article_file).name;
                            const article = JSON.parse((await fs_extra_1.default.readFile((0, path_1.join)(archivePath, prefix, resource, prefix2, article_file))).toString());
                            const tags = JSON.parse((await fs_extra_1.default.readFile((0, path_1.join)(archivePath, prefix, resource, prefix2, `${article_id}.tags`))).toString());
                            if (!article_map[article_id])
                                article_map[article_id] = {
                                    title: article.title,
                                    dates: article.dates,
                                    authors: article.authors,
                                    is_range_date: article.is_range_date,
                                    tag_ids: [],
                                    book_ids: [],
                                    tags: tags,
                                    books: [],
                                };
                            article_map[article_id].books?.push({
                                name: bookMetaData.name,
                                archive_id: i,
                                id: bookMetaData.id,
                            });
                        }
                    }
                }
            }
        }
    }
    const article_list = article_map_to_list(article_map);
    const chunk_size = 10000;
    let n_chunk = Math.floor(article_list.length / chunk_size) + 1;
    if (article_list.length % chunk_size == 0) {
        n_chunk--;
    }
    fs_extra_1.default.ensureDirSync((0, path_1.join)(__dirname, '../indexes'));
    fs_extra_1.default.writeFileSync((0, path_1.join)(__dirname, '../indexes/file_count.json'), JSON.stringify({
        article_list: n_chunk,
    }));
    for (let i = 0; i < n_chunk; i++) {
        const a_list = article_list.slice(i * chunk_size, (i + 1) * chunk_size);
        const b_map = new Map();
        const books = [];
        const t_map = new Map();
        const tags = [];
        fs_extra_1.default.writeFileSync((0, path_1.join)(__dirname, `../indexes/article_list_with_book_info_${i}.json`), JSON.stringify(a_list.map((x) => [
            x.id,
            x.books.map((j) => [j.id, j.name, j.archive_id]),
        ])));
        a_list.forEach((i) => {
            i.books.forEach((j) => {
                if (!b_map.has(j.id)) {
                    books.push(j.name);
                    b_map.set(j.id, books.length - 1);
                    i.book_ids.push(books.length - 1);
                }
                else {
                    i.book_ids.push(b_map.get(j.id));
                }
            });
            i.tags.forEach((j) => {
                const id = `${j.type}--${j.name}`;
                if (!t_map.has(id)) {
                    tags.push(j);
                    t_map.set(id, tags.length - 1);
                    i.tag_ids.push(tags.length - 1);
                }
                else {
                    i.tag_ids.push(t_map.get(id));
                }
            });
            delete i.books;
            delete i.tags;
        });
        fs_extra_1.default.writeFileSync((0, path_1.join)(__dirname, `../indexes/article_list_${i}.json`), JSON.stringify({
            articles: a_list,
            books,
            tags,
        }));
    }
    fs_extra_1.default.writeFileSync((0, path_1.join)(__dirname, '../indexes/gallery.json'), JSON.stringify(gallery_indexes));
    fs_extra_1.default.writeFileSync((0, path_1.join)(__dirname, '../indexes/music.json'), JSON.stringify(music_indexes));
})();
