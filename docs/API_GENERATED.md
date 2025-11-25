# API 文档（自动生成） / API Documentation (Auto-generated)

> ⚠️ **注意**: 本文档由脚本自动生成，请勿手动编辑。如需更新，请修改 `utils/index.ts` 中的代码注释。
>
> ⚠️ **Note**: This document is auto-generated. Please update code comments in `utils/index.ts` instead of editing this file directly.

**最后生成时间 / Last Generated**: 2025/11/25 14:17:58

## 概述 / Overview

本文档包含项目中所有工具函数的 API 说明，这些函数定义在 `utils/index.ts` 中。

This document contains API documentation for all utility functions defined in `utils/index.ts`.

## 函数列表 / Function List

### md5

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `inputString` | string |  |

**示例 / Examples:**

```typescript
 * md5('hello world') // '5d41402abc4b2a76b9719d911017c592'
 * ```

---

### extract_pivots

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `s` | string |  |
| `part_idx` | number |  |

**返回值 / Returns:**

- **类型 / Type**: `[Pivot[], string]`

**示例 / Examples:**

```typescript
 * const [pivots, cleanText] = extract_pivots('毛泽东〔1〕是伟大的领袖', 0);
 * // pivots: [{ part_idx: 0, offset: 6, index: 1 }]
 * // cleanText: '毛泽东是伟大的领袖'
 * ```

---

### apply_patch_v2

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `parserResult` | ParserResult |  |
| `patch` | PatchV2 |  |

**返回值 / Returns:**

- **类型 / Type**: `ParserResult`

**示例 / Examples:**

```typescript
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

---

### apply_patch

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `parserResult` | ParserResult |  |
| `patch` | Patch |  |

**示例 / Examples:**

```typescript
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

---

### ensure_two_digits

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `a` | number | undefined |  |
| `fallback` | any |  |

**示例 / Examples:**

```typescript
 * ensure_two_digits(5)    // '05'
 * ensure_two_digits(12)   // '12'
 * ensure_two_digits(undefined) // '00'
 * ```

---

### crypto_md5

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `str` | string |  |

**示例 / Examples:**

```typescript
 * crypto_md5('hello world') // '5d41402abc4b2a76b9719d911017c592'
 * ```

---

### get_article_id

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `r` | ParserResult |  |

**示例 / Examples:**

```typescript
 * const articleId = get_article_id(parserResult);
 * // 返回类似 '883eeb87ad' 的字符串
 * ```

---

### sleep

**参数 / Parameters:**

| 参数名 / Name | 类型 / Type | 说明 / Description |
|--------------|------------|-------------------|
| `t` | number |  |

**示例 / Examples:**

```typescript
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

---

### uuid

**示例 / Examples:**

```typescript
 * const id = uuid();
 * // 返回类似 '550e8400-e29b-41d4-a716-446655440000' 的字符串
 * ```

---

