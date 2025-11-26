"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const posix_1 = require("node:path/posix");
const node_fs_1 = __importDefault(require("node:fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const json5_1 = __importDefault(require("json5"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const node_os_1 = require("node:os");
const { fromBuffer } = require('file-type-cjs');
const body = (process.env.BODY || '').trim();
async function download(url, filePath) {
    const writer = node_fs_1.default.createWriteStream(filePath);
    const response = await (0, axios_1.default)({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(undefined));
        writer.on('error', reject);
    });
}
async function start() {
    try {
        const body1 = body.substring(0, body.lastIndexOf('```'));
        const body2 = body1.substring(body1.lastIndexOf('```') + 3);
        const config = json5_1.default.parse(body2);
        const id = (0, utils_1.uuid)();
        config.archive_id = config.archive_id == undefined ? 1 : config.archive_id;
        const raw_dir = (0, posix_1.join)(__dirname, `../raw/archives${config.archive_id}`);
        const raw_url = `https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives${config.archive_id}/main/`;
        const config_dir = (0, posix_1.join)(__dirname, `../config/archives${config.archive_id}`);
        const links = Array.from(body.matchAll(/\[.*?\]\(http.*?\)/g)).map((i) => i[0].replace(/^.*\(/, '').replace(/\)/, ''));
        let metadata;
        let resource_config;
        if (config.resource_type === 'book') {
            const files = [];
            for (const link of links) {
                const p = (0, posix_1.join)((0, node_os_1.tmpdir)(), (0, posix_1.basename)(link));
                await download(link, p);
                const real_ext = (await fromBuffer(node_fs_1.default.readFileSync(p)))?.ext;
                if (!real_ext)
                    process.exit(3);
                const new_path = (0, posix_1.join)((0, node_os_1.tmpdir)(), files.length + 1 + '.' + real_ext);
                node_fs_1.default.renameSync(p, new_path);
                files.push(new_path);
            }
            const is_pdf = files.length == 1 && files[0].endsWith('.pdf');
            const is_img_set = files.length > 0 &&
                files.reduce((a, b) => a &&
                    (b.endsWith('.png') || b.endsWith('.jpg') || b.endsWith('.jpeg')), true);
            if (!is_pdf && !is_img_set) {
                process.exit(4);
            }
            /**
             * 1. 新增 config/archives[n]/[id].ts
             * 2. 如果是图片集，下载图片到 raw/archives${n}/${id}/${img}
                  如果是pdf 下载到 raw/archives${n}/${id}
             * 3. 在 archives${n} main 分支创建 pr
             * 4. 在 archives${n} config 分支创建 pr
             * config分支的合并会自动运行ocr生成ocr_cache->parsed->page build
             */
            config.articles.forEach((i) => {
                i.page_start = i.page_start || 1;
                i.page_end = i.page_end || links.length;
            });
            metadata = {
                id,
                name: config.source_name,
                internal: !!config.internal,
                official: !!config.official,
                type: is_pdf ? 'pdf' : is_img_set ? 'img' : 'unknown',
                author: config.author || '',
                files: files.map((i) => is_pdf ? raw_url + id + '.pdf' : raw_url + id + '/' + (0, posix_1.basename)(i)),
            };
            resource_config = {
                resource_type: 'book',
                entity: metadata,
                version: 2,
                parser_option: {
                    articles: config.articles,
                    ocr: {
                        use_onnx: true,
                        det_model_dir: './paddle/onnx/ch_PP-OCRv4_det_infer.onnx',
                        rec_model_dir: './paddle/onnx/ch_PP-OCRv4_rec_infer.onnx',
                        ...config.ocr,
                    },
                    ocr_exceptions: config.ocr_exceptions || {},
                },
                parser_id: 'automation',
                path: is_img_set ? id : is_pdf ? id + '.pdf' : '',
            };
            for (const i of files) {
                if (is_img_set) {
                    fs_extra_1.default.ensureDirSync((0, posix_1.join)(raw_dir, `${id}`));
                    node_fs_1.default.renameSync(i, (0, posix_1.join)(raw_dir, `${id}/${(0, posix_1.basename)(i)}`));
                }
                else {
                    node_fs_1.default.renameSync(i, (0, posix_1.join)(raw_dir, `${id}.pdf`));
                }
            }
        }
        else if (config.resource_type === 'music') {
            const filtered = { ...config };
            delete filtered.archive_id;
            delete filtered.resource_type;
            metadata = filtered;
            resource_config = {
                resource_type: config.resource_type,
                entity: metadata,
                version: 2,
            };
            let lyric_idx = 0;
            let audio_idx = 0;
            for (const link of links) {
                const id = (0, utils_1.uuid)();
                const p = (0, posix_1.join)(raw_dir, id + (0, posix_1.extname)(link));
                await download(link, p);
                if (!resource_config.entity.lyrics[lyric_idx].audios[audio_idx]) {
                    audio_idx++;
                }
                if (!resource_config.entity.lyrics[lyric_idx].audios[audio_idx]) {
                    audio_idx = 0;
                    lyric_idx++;
                }
                resource_config.entity.lyrics[0].audios[0].url =
                    raw_url + `${id}${(0, posix_1.extname)(link)}`;
            }
        }
        else if (config.resource_type === 'picture') {
            const filtered = { ...config };
            delete filtered.archive_id;
            delete filtered.resource_type;
            metadata = filtered;
            resource_config = {
                resource_type: config.resource_type,
                entity: metadata,
                version: 2,
            };
            const p = (0, posix_1.join)(raw_dir, id);
            await download(links[0], p);
            const real_ext = (await fromBuffer(node_fs_1.default.readFileSync(p)))?.ext;
            node_fs_1.default.renameSync(p, (0, posix_1.join)(raw_dir, id + '.' + real_ext));
            resource_config.entity.url = raw_url + id + '.' + real_ext;
        }
        else if (config.resource_type === 'video') {
            const filtered = { ...config };
            delete filtered.archive_id;
            delete filtered.resource_type;
            metadata = filtered;
            resource_config = {
                resource_type: config.resource_type,
                entity: metadata,
                version: 2,
            };
            const p = (0, posix_1.join)(raw_dir, id);
            await download(links[0], p);
            const real_ext = (await fromBuffer(node_fs_1.default.readFileSync(p)))?.ext;
            node_fs_1.default.renameSync(p, (0, posix_1.join)(raw_dir, id + '.' + real_ext));
            resource_config.entity.url = raw_url + id + '.' + real_ext;
        }
        else {
            process.exit(5);
        }
        const file_content = `export default ${JSON.stringify(resource_config)};`;
        node_fs_1.default.writeFileSync((0, posix_1.join)(config_dir, `${id}.ts`), file_content);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}
if (!process.env.TEST) {
    start();
}
