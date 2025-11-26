"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_1 = require("../utils");
const types_1 = require("../types");
(0, vitest_1.describe)('get_article_id', () => {
    // Helper function to create base parser result
    const createBaseParserResult = (overrides = {}) => ({
        title: 'Test Article',
        dates: [{ year: 2023, month: 12, day: 25 }],
        is_range_date: false,
        authors: ['Test Author'],
        parts: [
            {
                text: 'Test content',
                type: types_1.ContentType.paragraph,
            },
        ],
        comments: [],
        comment_pivots: [],
        description: '',
        page_start: 1,
        page_end: 1,
        ...overrides,
    });
    (0, vitest_1.describe)('basic functionality', () => {
        (0, vitest_1.it)('should generate a valid 10-character hex string ID', () => {
            const result = createBaseParserResult();
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should generate consistent IDs for identical input', () => {
            const result1 = createBaseParserResult();
            const result2 = createBaseParserResult();
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).toBe(id2);
        });
        (0, vitest_1.it)('should generate different IDs for different titles', () => {
            const result1 = createBaseParserResult({ title: 'Article 1' });
            const result2 = createBaseParserResult({ title: 'Article 2' });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).not.toBe(id2);
        });
        (0, vitest_1.it)('should generate different IDs for different authors', () => {
            const result1 = createBaseParserResult({ authors: ['Author A'] });
            const result2 = createBaseParserResult({ authors: ['Author B'] });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).not.toBe(id2);
        });
        (0, vitest_1.it)('should generate different IDs for different dates', () => {
            const result1 = createBaseParserResult({
                dates: [{ year: 2023, month: 1, day: 1 }]
            });
            const result2 = createBaseParserResult({
                dates: [{ year: 2023, month: 1, day: 2 }]
            });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).not.toBe(id2);
        });
    });
    (0, vitest_1.describe)('title variations', () => {
        (0, vitest_1.it)('should handle empty title', () => {
            const result = createBaseParserResult({ title: '' });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle unicode characters in title', () => {
            const result = createBaseParserResult({ title: '毛泽东的讲话' });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle long titles', () => {
            const longTitle = 'A'.repeat(1000);
            const result = createBaseParserResult({ title: longTitle });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle special characters in title', () => {
            const result = createBaseParserResult({ title: 'Title with !@#$%^&*()' });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
    });
    (0, vitest_1.describe)('author variations', () => {
        (0, vitest_1.it)('should handle empty authors array', () => {
            const result = createBaseParserResult({ authors: [] });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle multiple authors', () => {
            const result = createBaseParserResult({
                authors: ['Author A', 'Author B', 'Author C']
            });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle authors with unicode characters', () => {
            const result = createBaseParserResult({
                authors: ['毛泽东', '周恩来']
            });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should generate same ID regardless of author order (authors are sorted)', () => {
            const result1 = createBaseParserResult({
                authors: ['Author A', 'Author B', 'Author C']
            });
            const result2 = createBaseParserResult({
                authors: ['Author C', 'Author B', 'Author A']
            });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).toBe(id2);
        });
    });
    (0, vitest_1.describe)('date variations', () => {
        (0, vitest_1.it)('should handle empty dates array', () => {
            const result = createBaseParserResult({ dates: [] });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle single date', () => {
            const result = createBaseParserResult({
                dates: [{ year: 2023, month: 12, day: 25 }]
            });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle multiple dates', () => {
            const result = createBaseParserResult({
                dates: [
                    { year: 2023, month: 12, day: 25 },
                    { year: 2023, month: 12, day: 26 }
                ]
            });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle incomplete dates', () => {
            const result = createBaseParserResult({
                dates: [
                    { year: 2023 }, // Only year
                    { year: 2023, month: 12 }, // Year and month
                    { year: 2023, month: 12, day: 25 } // Complete date
                ]
            });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle date range flag', () => {
            const result1 = createBaseParserResult({
                dates: [{ year: 2023, month: 12, day: 25 }],
                is_range_date: false
            });
            const result2 = createBaseParserResult({
                dates: [{ year: 2023, month: 12, day: 25 }],
                is_range_date: true
            });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).not.toBe(id2);
        });
        (0, vitest_1.it)('should sort dates correctly', () => {
            const result1 = createBaseParserResult({
                dates: [
                    { year: 2023, month: 12, day: 25 },
                    { year: 2023, month: 12, day: 24 }
                ]
            });
            const result2 = createBaseParserResult({
                dates: [
                    { year: 2023, month: 12, day: 24 },
                    { year: 2023, month: 12, day: 25 }
                ]
            });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).toBe(id2); // Should be the same since dates are sorted
        });
    });
    (0, vitest_1.describe)('file_id variations', () => {
        (0, vitest_1.it)('should handle undefined file_id', () => {
            const result = createBaseParserResult({ file_id: undefined });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle empty file_id', () => {
            const result = createBaseParserResult({ file_id: '' });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle non-empty file_id', () => {
            const result = createBaseParserResult({ file_id: 'test-file-id' });
            const id = (0, utils_1.get_article_id)(result);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should generate different IDs for different file_ids', () => {
            const result1 = createBaseParserResult({ file_id: 'file1' });
            const result2 = createBaseParserResult({ file_id: 'file2' });
            const id1 = (0, utils_1.get_article_id)(result1);
            const id2 = (0, utils_1.get_article_id)(result2);
            (0, vitest_1.expect)(id1).not.toBe(id2);
        });
    });
    (0, vitest_1.describe)('ID uniqueness and distribution', () => {
        (0, vitest_1.it)('should generate unique IDs for different articles', () => {
            const results = [
                createBaseParserResult({ title: 'Article 1', authors: ['Author A'] }),
                createBaseParserResult({ title: 'Article 2', authors: ['Author A'] }),
                createBaseParserResult({ title: 'Article 1', authors: ['Author B'] }),
                createBaseParserResult({ title: 'Article 1', authors: ['Author A'], dates: [{ year: 2024 }] }),
            ];
            const ids = results.map(r => (0, utils_1.get_article_id)(r));
            const uniqueIds = new Set(ids);
            (0, vitest_1.expect)(uniqueIds.size).toBe(ids.length); // All IDs should be unique
        });
        (0, vitest_1.it)('should generate IDs with good distribution (no obvious patterns)', () => {
            const ids = Array.from({ length: 100 }, (_, i) => (0, utils_1.get_article_id)(createBaseParserResult({
                title: `Article ${i}`,
                authors: [`Author ${i}`]
            })));
            // Check that IDs are not all the same
            const uniqueIds = new Set(ids);
            (0, vitest_1.expect)(uniqueIds.size).toBeGreaterThan(95); // Should have high uniqueness
            // Check that IDs don't follow obvious sequential patterns
            const firstChars = ids.map(id => id.charAt(0));
            const uniqueFirstChars = new Set(firstChars);
            (0, vitest_1.expect)(uniqueFirstChars.size).toBeGreaterThan(5); // Should have variety in first character
        });
    });
    (0, vitest_1.describe)('edge cases', () => {
        (0, vitest_1.it)('should handle minimal valid parser result', () => {
            const minimalResult = {
                title: '',
                dates: [],
                is_range_date: false,
                authors: [],
                parts: [],
                comments: [],
                comment_pivots: [],
                description: '',
                page_start: 0,
                page_end: 0,
            };
            const id = (0, utils_1.get_article_id)(minimalResult);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
        (0, vitest_1.it)('should handle complex real-world data', () => {
            const complexResult = createBaseParserResult({
                title: '关于社会主义革命和社会主义建设时期党史若干问题的决议',
                authors: ['中国共产党中央委员会', '毛泽东', '邓小平'],
                dates: [
                    { year: 1981, month: 6, day: 27 },
                    { year: 1981, month: 7, day: 1 }
                ],
                is_range_date: false,
                file_id: 'resolution-1981',
                description: 'This is a complex historical document about party history.'
            });
            const id = (0, utils_1.get_article_id)(complexResult);
            (0, vitest_1.expect)(id).toHaveLength(10);
            (0, vitest_1.expect)(id).toMatch(/^[a-f0-9]{10}$/);
        });
    });
});
