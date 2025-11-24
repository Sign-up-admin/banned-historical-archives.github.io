/**
 * @fileoverview 通用工具函数集合
 *
 * 包含 MD5 哈希、文本处理、补丁应用、ID 生成等实用工具函数。
 * 这些函数主要用于数据处理、文本分析和版本控制。
 */

import { diff_match_patch, Diff } from 'diff-match-patch';
import crypto from 'crypto';
import {
  ArticleCategory,
  ArticleType,
  ContentPart,
  ParserResult,
  Patch,
  PatchV2,
  Pivot,
  TagType,
} from '../types';
import { v4 } from 'uuid';

/**
 * MD5 哈希函数
 *
 * 基于 Paul Johnston & Greg Holt 的 MD5 实现。
 * 用于生成字符串的 MD5 哈希值。
 *
 * @param inputString - 要哈希的输入字符串
 * @returns 32位十六进制 MD5 哈希字符串
 *
 * @example
 * ```typescript
 * md5('hello world') // '5d41402abc4b2a76b9719d911017c592'
 * ```
 */
export function md5(inputString: string) {
  var hc = '0123456789abcdef';
  function rh(n: number) {
    var j,
      s = '';
    for (j = 0; j <= 3; j++)
      s +=
        hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
    return s;
  }
  function ad(x: number, y: number) {
    var l = (x & 0xffff) + (y & 0xffff);
    var m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xffff);
  }
  function rl(n: number, c: number) {
    return (n << c) | (n >>> (32 - c));
  }
  function cm(
    q: number,
    a: number,
    b: number,
    x: number,
    s: number,
    t: number,
  ) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
  }
  function ff(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return cm((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return cm((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return cm(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return cm(c ^ (b | ~d), a, b, x, s, t);
  }
  function sb(x: string) {
    var i;
    var nblk = ((x.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);
    for (i = 0; i < nblk * 16; i++) blks[i] = 0;
    for (i = 0; i < x.length; i++)
      blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = x.length * 8;
    return blks;
  }
  var i,
    x = sb(inputString),
    a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878,
    olda,
    oldb,
    oldc,
    oldd;
  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = ad(a, olda);
    b = ad(b, oldb);
    c = ad(c, oldc);
    d = ad(d, oldd);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

/**
 * 注释括号字符常量
 * 用于标识文本中的注释引用位置
 */
export const bracket_left = '〔';
export const bracket_right = '〕';

/**
 * 从文本中提取注释引用位置
 *
 * 解析文本中的注释标记（如"〔1〕"），提取位置信息并返回清理后的文本。
 * 用于处理文章中的注释引用，支持多级嵌套注释。
 *
 * @param s - 包含注释标记的文本
 * @param part_idx - 文本段落在文章中的索引
 * @returns 元组：[提取的注释位置数组, 清理后的文本]
 *
 * @example
 * ```typescript
 * const [pivots, cleanText] = extract_pivots('毛泽东〔1〕是伟大的领袖', 0);
 * // pivots: [{ part_idx: 0, offset: 6, index: 1 }]
 * // cleanText: '毛泽东是伟大的领袖'
 * ```
 */
export function extract_pivots(s: string, part_idx: number): [Pivot[], string] {
  const res: Pivot[] = [];
  const exp = new RegExp(`${bracket_left}\\d+${bracket_right}`);
  while (true) {
    const idx = s.search(exp);
    if (idx == -1) {
      break;
    }
    const index = parseInt(s.match(exp)![0].substr(1));
    s = s.replace(exp, '');
    res.push({ part_idx: part_idx, offset: idx, index });
  }
  return [res, s];
}

/**
 * 应用 V2 版本补丁到解析结果
 *
 * 支持高级补丁操作：
 * 1) 编辑/删除/插入段落，修改段落类型
 * 2) 编辑/删除/插入注释
 * 3) 编辑/删除描述
 *
 * V2 补丁比 V1 补丁更强大，支持插入操作和更细粒度的编辑。
 *
 * @param parserResult - 原始解析结果
 * @param patch - V2 版本补丁对象
 * @returns 应用补丁后的新解析结果（不修改原对象）
 *
 * @example
 * ```typescript
 * const patchedResult = apply_patch_v2(originalResult, {
 *   parts: {
 *     '0': { // 修改第1段
 *       type: 'paragraph',
 *       insertBefore: [{ text: '新增段落', type: 'paragraph' }]
 *     }
 *   },
 *   newComments: ['新增注释']
 * });
 * ```
 */
export function apply_patch_v2(
  parserResult: ParserResult,
  patch: PatchV2,
): ParserResult {
  const { parts, comment_pivots, comments } = parserResult;
  const final_parts: ContentPart[] = [];
  const final_comments: string[] = [];
  const final_pivots: Pivot[] = [];
  for (let i in parts) {
    const idx = parseInt(i);
    if (patch.parts[i]) {
      if (patch.parts[i].insertBefore)
        for (const j of patch.parts[i].insertBefore!) {
          const [pivots, k] = extract_pivots(j.text, final_parts.length);
          final_parts.push({ type: j.type, text: k });
          final_pivots.push(...pivots);
        }
      if (!patch.parts[i].delete) {
        let final_text = parts[i].text;
        if (patch.parts[i].diff) {
          const original_text_arr = Array.from(parts[idx].text);
          // 恢复bracket
          comment_pivots
            .filter((i) => i.part_idx === idx)
            .sort((a, b) => b.index - a.index)
            .forEach((i) =>
              original_text_arr.splice(
                i.offset,
                0,
                `${bracket_left}${i.index}${bracket_right}`,
              ),
            );
          const original_text_with_brackets = original_text_arr.join('');
          final_text = new diff_match_patch()
            .diff_fromDelta(original_text_with_brackets, patch.parts[i].diff!)
            .filter((i) => i[0] !== -1)
            .map((i) => i[1])
            .join('');
        }

        const [pivots, final_text_without_brackets] = extract_pivots(
          final_text,
          final_parts.length,
        );
        final_parts.push({
          type: patch.parts[i].type || parts[i].type,
          text: final_text_without_brackets,
        });
        final_pivots.push(...pivots);
      }
      if (patch.parts[i].insertAfter)
        for (const j of patch.parts[i].insertAfter!) {
          const [pivots, k] = extract_pivots(j.text, final_parts.length);
          final_parts.push({ type: j.type, text: k });
          final_pivots.push(...pivots);
        }
    } else {
      final_pivots.push(
        ...comment_pivots
          .filter((j) => j.part_idx === idx)
          .map((j) => ({ ...j, part_idx: final_parts.length })),
      );
      final_parts.push(parts[i]);
    }
  }
  if (patch.newComments && patch.newComments.length) {
    final_comments.push(...patch.newComments);
  } else {
    for (let idx_from_0 in comments) {
      const idx_from_1 = parseInt(idx_from_0) + 1;
      if (patch.comments[idx_from_1]) {
        if (patch.comments[idx_from_1].insertBefore)
          final_comments.push(
            ...patch.comments[idx_from_1].insertBefore!.map((j) => j.text),
          );
        if (!patch.comments[idx_from_1].delete) {
          const final_text = patch.comments[idx_from_1].diff
            ? new diff_match_patch()
                .diff_fromDelta(
                  comments[idx_from_0],
                  patch.comments[idx_from_1].diff!,
                )
                .filter((i) => i[0] !== -1)
                .map((i) => i[1])
                .join('')
            : comments[idx_from_0];
          final_comments.push(final_text);
        }
        if (patch.comments[idx_from_1].insertAfter)
          final_comments.push(
            ...patch.comments[idx_from_1].insertAfter!.map((j) => j.text),
          );
      } else {
        final_comments.push(parserResult.comments[idx_from_0]);
      }
    }
  }

  const newResult: ParserResult = { ...parserResult };
  newResult.comments = final_comments;
  newResult.parts = final_parts;
  newResult.comment_pivots = final_pivots;
  if (typeof patch.description === 'string') {
    if (patch.description.length) {
      newResult.description = new diff_match_patch()
        .diff_fromDelta(parserResult.description || '', patch.description)
        .filter((i) => i[0] !== -1)
        .map((i) => i[1])
        .join('');
    }
  } else {
    newResult.description = '';
  }
  return newResult;
}

/**
 * 应用 V1 版本补丁到解析结果
 * Apply V1 patch to parser result
 *
 * 使用 diff-match-patch 算法应用文本差异补丁，支持：
 * - 段落文本修改（通过 diff 字符串）
 * - 注释文本修改（通过 diff 字符串）
 * - 描述文本修改（通过 diff 字符串）
 *
 * V1 补丁是较早期的补丁格式，使用 diff 字符串表示变更。
 * 注意：此函数会直接修改 parserResult 对象。
 *
 * Uses diff-match-patch algorithm to apply text difference patches, supporting:
 * - Paragraph text modification (via diff strings)
 * - Comment text modification (via diff strings)
 * - Description text modification (via diff strings)
 *
 * V1 patch is an earlier patch format using diff strings to represent changes.
 * Note: This function directly modifies the parserResult object.
 *
 * @param parserResult - 要修改的解析结果对象 / Parser result object to modify
 * @param patch - V1 版本补丁对象 / V1 patch object
 *
 * @example
 * ```typescript
 * apply_patch(parserResult, {
 *   parts: {
 *     '0': 'diff字符串表示第1段的修改' // diff string for part 0 modification
 *   },
 *   comments: {
 *     '1': 'diff字符串表示注释1的修改' // diff string for comment 1 modification
 *   },
 *   description: 'diff字符串表示描述的修改' // diff string for description modification
 * });
 * ```
 */
export function apply_patch(parserResult: ParserResult, patch: Patch) {
  const d = new diff_match_patch();
  const { parts, comment_pivots } = parserResult;
  Object.keys(patch.parts).forEach((i) => {
    const idx = parseInt(i);
    const text_arr = Array.from(parts[idx].text);
    comment_pivots
      .filter((i) => i.part_idx === idx)
      .sort((a, b) => b.index - a.index)
      .forEach((i) =>
        text_arr.splice(
          i.offset,
          0,
          `${bracket_left}${i.index}${bracket_right}`,
        ),
      );
    const origin_text = text_arr.join('');
    const diff = d.diff_fromDelta(origin_text, patch.parts[i]);
    const new_text = diff
      .filter((i) => i[0] !== -1)
      .map((i) => i[1])
      .join('');
    parserResult.comment_pivots = comment_pivots.filter(
      (x) => x.part_idx !== idx,
    );
    const [pivots, pure_text] = extract_pivots(new_text, idx);
    parserResult.comment_pivots.push(...pivots);
    parts[idx].text = pure_text;
  });
  Object.keys(patch.comments).forEach((i) => {
    const idx = parseInt(i);
    const diff = d.diff_fromDelta(
      parserResult.comments[idx - 1],
      patch.comments[i],
    );
    const new_text = diff
      .filter((i) => i[0] !== -1)
      .map((i) => i[1])
      .join('');
    parserResult.comments[idx - 1] = new_text;
  });
  if (patch.description) {
    const diff = d.diff_fromDelta(parserResult.description, patch.description);
    const new_text = diff
      .filter((i) => i[0] !== -1)
      .map((i) => i[1])
      .join('');
    patch.description = new_text;
  }
}

/**
 * 确保数字至少显示两位
 *
 * 用于日期格式化，确保月份和日期始终显示两位数字。
 *
 * @param a - 要格式化的数字
 * @param fallback - 当输入无效时的默认值
 * @returns 格式化后的两位数字符串
 *
 * @example
 * ```typescript
 * ensure_two_digits(5)    // '05'
 * ensure_two_digits(12)   // '12'
 * ensure_two_digits(undefined) // '00'
 * ```
 */
export function ensure_two_digits(a: number | undefined, fallback = '00') {
  if (!a && a !== 0) {
    return fallback;
  }
  return a < 10 ? `0${a}` : a;
}

/**
 * 使用 Node.js crypto 模块生成 MD5 哈希
 *
 * 比自定义 MD5 实现更安全和高效。
 *
 * @param str - 要哈希的输入字符串
 * @returns 32位十六进制 MD5 哈希字符串
 *
 * @example
 * ```typescript
 * crypto_md5('hello world') // '5d41402abc4b2a76b9719d911017c592'
 * ```
 */
export function crypto_md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * 根据文章内容生成唯一文章 ID
 *
 * 使用文章的关键信息（标题、日期、作者等）生成 MD5 哈希，
 * 确保相同内容的文章总是生成相同的 ID。
 *
 * @param r - 解析后的文章结果
 * @returns 10位十六进制文章 ID
 *
 * @example
 * ```typescript
 * const articleId = get_article_id(parserResult);
 * // 返回类似 '883eeb87ad' 的字符串
 * ```
 */
export function get_article_id(r: ParserResult) {
  const res = crypto_md5(
    JSON.stringify([
      r.title,
      r.dates
        .sort((a, b) =>
          `${a.year || '0000'}-${ensure_two_digits(
            a.month,
          )}-${ensure_two_digits(a.day)}` >
          `${b.year || '0000'}-${ensure_two_digits(
            b.month,
          )}-${ensure_two_digits(b.day)}`
            ? 1
            : -1,
        )
        .map(
          (a) =>
            `${a.year || '0000'}-${ensure_two_digits(
              a.month,
            )}-${ensure_two_digits(a.day)}`,
        ),
      !!r.is_range_date,
      r.authors.sort((a, b) => (a > b ? 1 : -1)),
      r.file_id || '',
    ]),
  );
  return res.substr(0, 10);
}

/**
 * 异步延迟函数
 *
 * 创建一个 Promise，在指定毫秒数后 resolve。
 * 用于实现延迟、轮询重试等异步操作。
 *
 * @param t - 延迟的毫秒数
 * @returns Promise，在延迟结束后 resolve
 *
 * @example
 * ```typescript
 * // 延迟 1 秒
 * await sleep(1000);
 *
 * // 重试机制
 * for (let i = 0; i < 3; i++) {
 *   try {
 *     await apiCall();
 *     break;
 *   } catch (error) {
 *     if (i < 2) await sleep(1000 * (i + 1));
 *   }
 * }
 * ```
 */
export async function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

/**
 * 生成 UUID v4 字符串
 *
 * 使用 uuid 库生成 RFC 4122 版本 4 的通用唯一标识符。
 * 用于生成唯一的标识符，如会话 ID、临时文件名等。
 *
 * @returns UUID v4 格式的字符串
 *
 * @example
 * ```typescript
 * const id = uuid();
 * // 返回类似 '550e8400-e29b-41d4-a716-446655440000' 的字符串
 * ```
 */
export function uuid() {
  return v4();
}
