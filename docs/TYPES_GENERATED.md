# 类型定义文档（自动生成） / Type Definitions Documentation (Auto-generated)

> ⚠️ **注意**: 本文档由脚本自动生成，请勿手动编辑。如需更新，请修改 `types/index.ts` 中的代码注释。
>
> ⚠️ **Note**: This document is auto-generated. Please update code comments in `types/index.ts` instead of editing this file directly.

**最后生成时间 / Last Generated**: 2025/11/25 02:55:12

## 概述 / Overview

本文档包含项目中所有 TypeScript 类型定义的说明，这些类型定义在 `types/index.ts` 中。

This document contains documentation for all TypeScript type definitions in `types/index.ts`.

## 类型列表 / Type List

### Tag

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 是 / Yes |  |
| `name` | `string` | 否 / No |  |
| `type` | `string` | 否 / No |  |

---

### Comment

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `index` | `number` | 否 / No |  |
| `part_idx` | `number` | 否 / No |  |
| `id` | `string` | 否 / No |  |
| `offset` | `number` | 否 / No |  |
| `text` | `string` | 否 / No |  |

---

### Content

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 否 / No |  |
| `type` | `ContentType` | 否 / No |  |
| `text` | `string` | 否 / No |  |
| `index` | `number` | 否 / No |  |

---

### Article

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `title` | `string` | 否 / No |  |
| `author` | `string[]` | 否 / No |  |
| `dates` | `Date[]` | 否 / No |  |
| `is_range_date` | `boolean` | 否 / No |  |
| `origin` | `string` | 是 / Yes |  |
| `alias` | `string` | 是 / Yes |  |
| `tags` | `Tag[]` | 否 / No |  |

---

### BookMetaData

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 否 / No |  |
| `name` | `string` | 否 / No |  |
| `internal` | `boolean` | 否 / No |  |
| `official` | `boolean` | 否 / No |  |
| `type` | `'img' | 'pdf' | 'db' | 'unknown'` | 否 / No |  |
| `author` | `string` | 否 / No |  |
| `files` | `string[]` | 否 / No |  |

---

### ResourceMetaData

---

### ContentPartRaw

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `text` | `string` | 否 / No |  |
| `type` | `ContentType` | 否 / No |  |

---

### ContentPart

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `text` | `string` | 否 / No |  |
| `type` | `ContentType` | 否 / No |  |

---

### Date

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `year` | `number` | 是 / Yes |  |
| `month` | `number` | 是 / Yes |  |
| `day` | `number` | 是 / Yes |  |

---

### MusicLyric

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `lyricists` | `string[]` | 否 / No |  |
| `version` | `string` | 否 / No |  |
| `content` | `string` | 否 / No |  |
| `audios` | `{
    /** 音频文件URL */
    url: string;
    /** 音频来源列表 */
    sources: string[];
    /** 艺术形式，如 '合唱'、'说书' 等 */
    art_forms: string[];
    /** 艺术家列表 */
    artists: {
      /** 艺术家姓名 */
      name: string;
      /** 艺术家类型，如 '伴奏'、'合唱团'、'领唱'、'乐团' 等 */
      type: string;
    }[];
  }[]` | 否 / No |  |

---

### Music

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 否 / No |  |
| `name` | `string` | 否 / No |  |
| `composers` | `string[]` | 否 / No |  |
| `description` | `string` | 否 / No |  |
| `lyrics` | `MusicLyric[]` | 否 / No |  |

---

### Pivot

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `part_idx` | `number` | 否 / No |  |
| `index` | `number` | 否 / No |  |
| `offset` | `number` | 否 / No |  |

---

### ParserResult

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `title` | `string` | 否 / No |  |
| `alias` | `string` | 是 / Yes |  |
| `dates` | `Date[]` | 否 / No |  |
| `is_range_date` | `boolean` | 否 / No |  |
| `authors` | `string[]` | 否 / No |  |
| `parts` | `ContentPart[]` | 否 / No |  |
| `comments` | `string[]` | 否 / No |  |
| `comment_pivots` | `Pivot[]` | 否 / No |  |
| `description` | `string` | 否 / No |  |
| `page_start` | `number` | 否 / No |  |
| `page_end` | `number` | 否 / No |  |
| `origin` | `string` | 是 / Yes |  |
| `tags` | `{
    /** 标签名称 */
    name: string;
    /** 标签类型 */
    type: TagType;
  }[]` | 是 / Yes |  |
| `file_id` | `string` | 是 / Yes |  |
| `title_raw` | `string` | 是 / Yes |  |
| `date_raw` | `string` | 是 / Yes |  |
| `parts_raw` | `ContentPartRaw[]` | 是 / Yes |  |

---

### OCRPosition

---

### OCRResult

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `box` | `[OCRPosition, OCRPosition, OCRPosition, OCRPosition]` | 否 / No |  |
| `text` | `string` | 否 / No |  |

---

### LACType

---

### LACResult

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `text` | `string` | 否 / No |  |
| `count` | `number` | 否 / No |  |
| `type` | `LACType` | 否 / No |  |

---

### AutomatedEntryBookOption

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `resource_type` | `'book'` | 是 / Yes |  |
| `source_name` | `string` | 否 / No |  |
| `archive_id` | `number` | 是 / Yes |  |
| `internal` | `boolean` | 是 / Yes |  |
| `official` | `boolean` | 是 / Yes |  |
| `author` | `string` | 否 / No |  |
| `articles` | `{
    title: string;
    authors: string[]; // 作者
    dates: Date[]; // 时间 或者 时间范围 或者 多个时间点
    is_range_date?: boolean; // 如果为 true 表示一段时间，如果为false表示多/单个时间点
    alias?: string; // 标题别名
    ocr?: Partial<OCRParameter & OCRParameterAdvanced>; // 此参数比全局ocr参数的优先级高，默认为空
    ocr_exceptions?: {
      [key: string]: Partial<OCRParameter & OCRParameterAdvanced>;
    };
    tags?: { name: string; type: keyof typeof TagType }[];
    page_start: number;
    page_end: number;
  }[]` | 否 / No |  |
| `ext` | `string` | 是 / Yes |  |
| `pdf_no_ocr` | `boolean` | 是 / Yes |  |
| `ocr` | `Partial<OCRParameter & OCRParameterAdvanced>` | 是 / Yes |  |
| `ocr_exceptions` | `{
    [key: string]: Partial<OCRParameter & OCRParameterAdvanced>;
  }` | 是 / Yes |  |

---

### AutomatedEntryMusicOption

---

### AutomatedEntryPictureOption

---

### AutomatedEntryVideoOption

---

### AutomatedEntryOption

---

### MusicMetaData

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 否 / No |  |
| `name` | `string` | 否 / No |  |
| `composers` | `string[]` | 否 / No |  |
| `description` | `string` | 否 / No |  |
| `tags` | `string[]` | 是 / Yes |  |
| `lyrics` | `MusicLyric[]` | 否 / No |  |

---

### PictureMetaData

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 否 / No |  |
| `name` | `string` | 否 / No |  |
| `description` | `string` | 否 / No |  |
| `source` | `string` | 否 / No |  |
| `url` | `string` | 否 / No |  |
| `year` | `number` | 是 / Yes |  |
| `month` | `number` | 是 / Yes |  |
| `day` | `number` | 是 / Yes |  |
| `tags` | `{ name: string; type: string }[]` | 否 / No |  |

---

### VideoMetaData

---

### OCRParameter

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `image_dir` | `string` | 否 / No |  |
| `use_gpu` | `boolean` | 否 / No |  |
| `use_xpu` | `boolean` | 否 / No |  |
| `use_npu` | `boolean` | 否 / No |  |
| `ir_optim` | `boolean` | 否 / No |  |
| `use_tensorrt` | `boolean` | 否 / No |  |
| `min_subgraph_size` | `number` | 否 / No |  |
| `precision` | `'fp32'` | 否 / No |  |
| `gpu_mem` | `number` | 否 / No |  |
| `gpu_id` | `number` | 否 / No |  |
| `use_onnx` | `boolean` | 否 / No |  |
| `page_num` | `number` | 否 / No |  |
| `det_algorithm` | `'DB'` | 否 / No |  |
| `det_limit_side_len` | `number` | 否 / No |  |
| `det_limit_type` | `'max' | 'min'` | 否 / No |  |
| `det_box_type` | `'quad'` | 否 / No |  |
| `det_model_dir` | `string` | 否 / No |  |
| `det_db_thresh` | `number` | 否 / No |  |
| `det_db_box_thresh` | `number` | 否 / No |  |
| `det_db_unclip_ratio` | `number` | 否 / No |  |
| `max_batch_size` | `number` | 否 / No |  |
| `use_dilation` | `boolean` | 否 / No |  |
| `det_db_score_mode` | `'fast'` | 否 / No |  |
| `det_east_score_thresh` | `number` | 否 / No |  |
| `det_east_cover_thresh` | `number` | 否 / No |  |
| `det_east_nms_thresh` | `number` | 否 / No |  |
| `det_sast_score_thresh` | `number` | 否 / No |  |
| `det_sast_nms_thresh` | `number` | 否 / No |  |
| `det_pse_thresh` | `number` | 否 / No |  |
| `det_pse_box_thresh` | `number` | 否 / No |  |
| `det_pse_min_area` | `number` | 否 / No |  |
| `det_pse_scale` | `number` | 否 / No |  |
| `scales` | `number[]` | 否 / No |  |
| `alpha` | `number` | 否 / No |  |
| `beta` | `number` | 否 / No |  |
| `fourier_degree` | `number` | 否 / No |  |
| `rec_model_dir` | `string` | 否 / No |  |
| `rec_algorithm` | `'SVTR_LCNet'` | 否 / No |  |
| `rec_image_inverse` | `boolean` | 否 / No |  |
| `rec_image_shape` | `'3, 48, 320'` | 否 / No |  |
| `rec_batch_num` | `number` | 否 / No |  |
| `max_text_length` | `number` | 否 / No |  |
| `rec_char_dict_path` | `'./paddle/ppocr_keys_v1.txt'` | 否 / No |  |
| `use_space_char` | `boolean` | 否 / No |  |
| `vis_font_path` | `string` | 否 / No |  |
| `drop_score` | `number` | 否 / No |  |
| `e2e_algorithm` | `string` | 否 / No |  |
| `e2e_model_dir` | `string` | 否 / No |  |
| `e2e_limit_side_len` | `number` | 否 / No |  |
| `e2e_limit_type` | `'max'` | 否 / No |  |
| `e2e_pgnet_score_thresh` | `number` | 否 / No |  |
| `e2e_char_dict_path` | `'./ppocr/utils/ic15_dict.txt'` | 否 / No |  |
| `e2e_pgnet_valid_set` | `'totaltext'` | 否 / No |  |
| `e2e_pgnet_mode` | `'fast'` | 否 / No |  |
| `use_angle_cls` | `boolean` | 否 / No |  |
| `cls_model_dir` | `string` | 否 / No |  |
| `cls_image_shape` | `'3, 48, 192'` | 否 / No |  |
| `label_list` | `['0', '180']` | 否 / No |  |
| `cls_batch_num` | `number` | 否 / No |  |
| `cls_thresh` | `number` | 否 / No |  |
| `enable_mkldnn` | `boolean` | 否 / No |  |
| `cpu_threads` | `number` | 否 / No |  |
| `use_pdserving` | `boolean` | 否 / No |  |
| `warmup` | `boolean` | 否 / No |  |
| `sr_image_shape` | `'3, 32, 128'` | 否 / No |  |
| `sr_batch_num` | `number` | 否 / No |  |
| `draw_img_save_dir` | `'./inference_results'` | 否 / No |  |
| `save_crop_res` | `boolean` | 否 / No |  |
| `crop_res_save_dir` | `'./output'` | 否 / No |  |
| `use_mp` | `boolean` | 否 / No |  |
| `total_process_num` | `number` | 否 / No |  |
| `process_id` | `number` | 否 / No |  |
| `benchmark` | `boolean` | 否 / No |  |
| `save_log_path` | `'./log_output/'` | 否 / No |  |
| `show_log` | `boolean` | 否 / No |  |

---

### ParserOption

---

### OCRParameterLegacy

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `rec_model` | `string` | 否 / No |  |
| `rec_backend` | `string` | 否 / No |  |
| `det_model` | `string` | 否 / No |  |
| `det_backend` | `string` | 否 / No |  |
| `resized_shape` | `number` | 否 / No |  |
| `box_score_thresh` | `number` | 否 / No |  |
| `min_box_size` | `number` | 否 / No |  |

---

### OCRParameterAdvanced

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `extract_text_from_pdf` | `boolean` | 否 / No |  |
| `line_merge_threshold` | `number` | 否 / No |  |
| `standard_paragraph_merge_strategy_threshold` | `number` | 否 / No |  |
| `differential_paragraph_merge_strategy_threshold` | `number` | 否 / No |  |
| `content_thresholds` | `[number, number, number, number]` | 否 / No |  |
| `auto_vsplit` | `boolean` | 否 / No |  |
| `vsplit` | `number` | 否 / No |  |

---

### BookConfig

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `resource_type` | `'book'` | 否 / No |  |
| `entity` | `Partial<BookMetaData>` | 否 / No |  |
| `path` | `string` | 否 / No |  |
| `parser_option` | `ParserOption` | 否 / No |  |
| `parser_id` | `string` | 否 / No |  |
| `parser` | `(path: string, opt: ParserOption) => Promise<ParserResult[]>` | 否 / No |  |
| `version` | `number` | 是 / Yes |  |

---

### MusicConfig

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `resource_type` | `'music'` | 否 / No |  |
| `version` | `number` | 是 / Yes |  |
| `entity` | `MusicMetaData` | 否 / No |  |

---

### PictureConfig

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `resource_type` | `'picture'` | 否 / No |  |
| `version` | `number` | 是 / Yes |  |
| `entity` | `PictureMetaData` | 否 / No |  |

---

### VideoConfig

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `resource_type` | `'video'` | 否 / No |  |
| `version` | `number` | 是 / Yes |  |
| `entity` | `VideoMetaData` | 否 / No |  |

---

### Config

---

### Patch

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `parts` | `{ [idx: string]: string }` | 否 / No |  |
| `comments` | `{ [idx: string]: string }` | 否 / No |  |
| `description` | `string` | 否 / No |  |

---

### StringDiff

---

### PartDiff

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `insertBefore` | `ContentPart[]` | 是 / Yes |  |
| `insertAfter` | `ContentPart[]` | 是 / Yes |  |
| `delete` | `boolean` | 是 / Yes |  |
| `diff` | `StringDiff` | 是 / Yes |  |
| `type` | `ContentType` | 是 / Yes |  |

---

### CommentDiff

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `insertBefore` | `{ id?: string; text: StringDiff }[]` | 是 / Yes |  |
| `insertAfter` | `{ id?: string; text: StringDiff }[]` | 是 / Yes |  |
| `delete` | `boolean` | 是 / Yes |  |
| `diff` | `StringDiff` | 是 / Yes |  |

---

### PatchV2

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `version` | `2` | 否 / No |  |
| `parts` | `{ [idx: string]: PartDiff }` | 否 / No |  |
| `comments` | `{ [idx: string]: CommentDiff }` | 否 / No |  |
| `newComments` | `string[]` | 是 / Yes |  |
| `description` | `StringDiff` | 是 / Yes |  |

---

### ArticleListV2

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `articles` | `{
    id: string;
    title: string;
    authors: string[];
    dates: any;
    is_range_date: boolean;
    book_ids: number[];
    tag_ids: number[];
  }[]` | 否 / No |  |
| `books` | `string[]` | 否 / No |  |
| `tags` | `{ name: string; type: string }[]` | 否 / No |  |

---

### ArticleList

---

### ArticleListItem

**属性 / Properties:**

| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |
|--------------|------------|----------------|-------------------|
| `id` | `string` | 否 / No |  |
| `title` | `string` | 否 / No |  |
| `authors` | `string[]` | 否 / No |  |
| `dates` | `Date[]` | 否 / No |  |
| `is_range_date` | `boolean` | 否 / No |  |
| `book_ids` | `number[]` | 否 / No |  |
| `books` | `string[]` | 是 / Yes |  |
| `tags` | `Tag[]` | 是 / Yes |  |
| `tag_ids` | `number[]` | 否 / No |  |

---

### ArticleIndexes

---

### TagIndexes

---

### ArticleIndexesWithBookInfo

---

### MusicIndex

---

### MusicIndexes

---

### GalleryIndexes

---

