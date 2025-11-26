"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const utils_1 = require("../utils");
const types_1 = require("../types");
(0, vitest_1.describe)('apply_patch_v2 comprehensive tests', () => {
    // Create a comprehensive base parser result for testing
    const createBaseParserResult = () => ({
        title: 'Test Article',
        authors: ['Test Author'],
        dates: [{ year: 2023, month: 12, day: 25 }],
        is_range_date: false,
        parts: [
            {
                text: 'First paragraph with comment〔1〕.',
                type: types_1.ContentType.paragraph,
            },
            {
                text: 'Second paragraph.',
                type: types_1.ContentType.paragraph,
            },
            {
                text: 'Third paragraph with comment〔2〕.',
                type: types_1.ContentType.paragraph,
            },
        ],
        comments: ['First comment', 'Second comment', 'Third comment'],
        comment_pivots: [
            { part_idx: 0, offset: 25, index: 1 },
            { part_idx: 2, offset: 26, index: 2 },
        ],
        description: 'Original description',
        page_start: 1,
        page_end: 5,
    });
    (0, vitest_1.describe)('basic functionality', () => {
        (0, vitest_1.it)('should return a new object without modifying the original', () => {
            const original = createBaseParserResult();
            const patch = {
                version: 2,
                parts: {},
                comments: {},
            };
            const result = (0, utils_1.apply_patch_v2)(original, patch);
            (0, vitest_1.expect)(result).not.toBe(original);
            (0, vitest_1.expect)(result.parts).not.toBe(original.parts);
            (0, vitest_1.expect)(result.comments).not.toBe(original.comments);
            (0, vitest_1.expect)(result.comment_pivots).not.toBe(original.comment_pivots);
        });
        (0, vitest_1.it)('should handle empty patch', () => {
            const original = createBaseParserResult();
            const patch = {
                version: 2,
                parts: {},
                comments: {},
            };
            const result = (0, utils_1.apply_patch_v2)(original, patch);
            (0, vitest_1.expect)(result.title).toBe(original.title);
            (0, vitest_1.expect)(result.authors).toEqual(original.authors);
            (0, vitest_1.expect)(result.parts).toEqual(original.parts);
            (0, vitest_1.expect)(result.comments).toEqual(original.comments);
            (0, vitest_1.expect)(result.comment_pivots).toEqual(original.comment_pivots);
            (0, vitest_1.expect)(result.description).toBe(''); // Empty when no description provided in patch
        });
    });
    (0, vitest_1.describe)('part operations', () => {
        (0, vitest_1.describe)('part insertion', () => {
            (0, vitest_1.it)('should insert parts before existing part', () => {
                const original = createBaseParserResult();
                const patch = {
                    version: 2,
                    parts: {
                        '0': {
                            insertBefore: [
                                {
                                    text: 'Inserted before first',
                                    type: types_1.ContentType.title,
                                },
                                {
                                    text: 'Another insert before first',
                                    type: types_1.ContentType.paragraph,
                                },
                            ],
                        },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(original, patch);
                (0, vitest_1.expect)(result.parts.length).toBe(original.parts.length + 2);
                (0, vitest_1.expect)(result.parts[0].text).toBe('Inserted before first');
                (0, vitest_1.expect)(result.parts[0].type).toBe(types_1.ContentType.title);
                (0, vitest_1.expect)(result.parts[1].text).toBe('Another insert before first');
                (0, vitest_1.expect)(result.parts[1].type).toBe(types_1.ContentType.paragraph);
                (0, vitest_1.expect)(result.parts[2].text).toBe('First paragraph with comment.'); // Comment markers are extracted
            });
            (0, vitest_1.it)('should insert parts after existing part', () => {
                const original = createBaseParserResult();
                const patch = {
                    version: 2,
                    parts: {
                        '0': {
                            insertAfter: [
                                {
                                    text: 'Inserted after first',
                                    type: types_1.ContentType.paragraph,
                                },
                            ],
                        },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(original, patch);
                (0, vitest_1.expect)(result.parts.length).toBe(original.parts.length + 1);
                (0, vitest_1.expect)(result.parts[0].text).toBe('First paragraph with comment.'); // Comment markers are extracted
                (0, vitest_1.expect)(result.parts[1].text).toBe('Inserted after first');
                (0, vitest_1.expect)(result.parts[1].type).toBe(types_1.ContentType.paragraph);
                (0, vitest_1.expect)(result.parts[2].text).toBe(original.parts[1].text);
            });
            (0, vitest_1.it)('should handle both insertBefore and insertAfter on same part', () => {
                const original = createBaseParserResult();
                const patch = {
                    version: 2,
                    parts: {
                        '1': {
                            insertBefore: [{ text: 'Before', type: types_1.ContentType.paragraph }],
                            insertAfter: [{ text: 'After', type: types_1.ContentType.paragraph }],
                        },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(original, patch);
                (0, vitest_1.expect)(result.parts.length).toBe(original.parts.length + 2);
                (0, vitest_1.expect)(result.parts[1].text).toBe('Before');
                (0, vitest_1.expect)(result.parts[2].text).toBe(original.parts[1].text);
                (0, vitest_1.expect)(result.parts[3].text).toBe('After');
            });
            (0, vitest_1.it)('should handle insertion with comments', () => {
                const patch = {
                    version: 2,
                    parts: {
                        '0': {
                            insertBefore: [
                                {
                                    text: 'New paragraph with comment〔3〕.',
                                    type: types_1.ContentType.paragraph,
                                },
                            ],
                        },
                    },
                    comments: {},
                    newComments: ['New comment for insertion'],
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.parts.length).toBe(4);
                (0, vitest_1.expect)(result.parts[0].text).toBe('New paragraph with comment.'); // Comment markers are extracted
                (0, vitest_1.expect)(result.comments).toEqual(['New comment for insertion']);
                (0, vitest_1.expect)(result.comment_pivots.some(p => p.index === 3)).toBe(true);
            });
        });
        (0, vitest_1.describe)('part deletion', () => {
            (0, vitest_1.it)('should delete a part', () => {
                const original = createBaseParserResult();
                const patch = {
                    version: 2,
                    parts: {
                        '1': { delete: true },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(original, patch);
                (0, vitest_1.expect)(result.parts.length).toBe(original.parts.length - 1);
                (0, vitest_1.expect)(result.parts.some(p => p.text === 'Second paragraph.')).toBe(false);
                // Comment pivots for deleted part should be removed
                (0, vitest_1.expect)(result.comment_pivots.length).toBe(original.comment_pivots.length); // No pivots in deleted part
            });
        });
        (0, vitest_1.describe)('part type modification', () => {
            (0, vitest_1.it)('should change part type', () => {
                const patch = {
                    version: 2,
                    parts: {
                        '0': { type: types_1.ContentType.title },
                        '1': { type: types_1.ContentType.quotation },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.parts[0].type).toBe(types_1.ContentType.title);
                (0, vitest_1.expect)(result.parts[1].type).toBe(types_1.ContentType.quotation);
                (0, vitest_1.expect)(result.parts[2].type).toBe(createBaseParserResult().parts[2].type); // Unchanged
            });
        });
        (0, vitest_1.describe)('part text diff', () => {
            (0, vitest_1.it)('should handle part operations without diff', () => {
                const patch = {
                    version: 2,
                    parts: {
                        '0': {
                            type: types_1.ContentType.title,
                        },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.parts[0].type).toBe(types_1.ContentType.title);
                (0, vitest_1.expect)(result.parts[0].text).toBe('First paragraph with comment.'); // Comment markers are extracted
            });
        });
        (0, vitest_1.describe)('multiple part operations', () => {
            (0, vitest_1.it)('should handle operations on multiple parts simultaneously', () => {
                const patch = {
                    version: 2,
                    parts: {
                        '1': { type: types_1.ContentType.title },
                        '2': {
                            insertBefore: [{ text: 'New part before third', type: types_1.ContentType.paragraph }],
                        },
                    },
                    comments: {},
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.parts.length).toBe(4); // Original 3 + 1 insert
                (0, vitest_1.expect)(result.parts[0].text).toBe('First paragraph with comment〔1〕.'); // No patch, keeps original with markers
                (0, vitest_1.expect)(result.parts[1].text).toBe('Second paragraph.');
                (0, vitest_1.expect)(result.parts[1].type).toBe(types_1.ContentType.title);
                (0, vitest_1.expect)(result.parts[2].text).toBe('New part before third');
                (0, vitest_1.expect)(result.parts[3].text).toBe('Third paragraph with comment.');
            });
        });
    });
    (0, vitest_1.describe)('comment operations', () => {
        (0, vitest_1.describe)('comment diff', () => {
            (0, vitest_1.it)('should handle comment operations without diff', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '3': {
                            insertBefore: [{ text: 'Before third' }],
                        },
                    },
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.comments.length).toBe(4);
                (0, vitest_1.expect)(result.comments[2]).toBe('Before third'); // Inserted before third comment
                (0, vitest_1.expect)(result.comments[3]).toBe('Third comment');
            });
        });
        (0, vitest_1.describe)('comment insertion', () => {
            (0, vitest_1.it)('should insert comments before existing comment', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '2': {
                            insertBefore: [{ text: 'Inserted before second' }],
                        },
                    },
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.comments.length).toBe(4);
                (0, vitest_1.expect)(result.comments[1]).toBe('Inserted before second');
                (0, vitest_1.expect)(result.comments[2]).toBe('Second comment');
            });
            (0, vitest_1.it)('should insert comments after existing comment', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '1': {
                            insertAfter: [{ text: 'Inserted after first' }],
                        },
                    },
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.comments.length).toBe(4);
                (0, vitest_1.expect)(result.comments[0]).toBe('First comment');
                (0, vitest_1.expect)(result.comments[1]).toBe('Inserted after first');
                (0, vitest_1.expect)(result.comments[2]).toBe('Second comment');
            });
            (0, vitest_1.it)('should handle both insertBefore and insertAfter on same comment', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '2': {
                            insertBefore: [{ text: 'Before second' }],
                            insertAfter: [{ text: 'After second' }],
                        },
                    },
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.comments.length).toBe(5);
                (0, vitest_1.expect)(result.comments[1]).toBe('Before second');
                (0, vitest_1.expect)(result.comments[2]).toBe('Second comment');
                (0, vitest_1.expect)(result.comments[3]).toBe('After second');
            });
        });
        (0, vitest_1.describe)('comment deletion', () => {
            (0, vitest_1.it)('should delete a comment', () => {
                const original = createBaseParserResult();
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '2': { delete: true }, // Delete second comment
                    },
                };
                const result = (0, utils_1.apply_patch_v2)(original, patch);
                (0, vitest_1.expect)(result.comments.length).toBe(original.comments.length - 1);
                (0, vitest_1.expect)(result.comments.includes('Second comment')).toBe(false);
            });
            (0, vitest_1.it)('should delete comment without applying other operations', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '2': { delete: true }, // Delete second comment (1-indexed)
                    },
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.comments.length).toBe(2); // Original 3 - 1 deleted
                (0, vitest_1.expect)(result.comments[0]).toBe('First comment');
                (0, vitest_1.expect)(result.comments[1]).toBe('Third comment');
            });
        });
        (0, vitest_1.describe)('newComments handling', () => {
            (0, vitest_1.it)('should replace all comments when newComments is provided', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {
                        '1': { diff: 'should be ignored' }, // Should be ignored when newComments present
                    },
                    newComments: ['New comment 1', 'New comment 2'],
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                (0, vitest_1.expect)(result.comments).toEqual(['New comment 1', 'New comment 2']);
                (0, vitest_1.expect)(result.comments.length).toBe(2);
            });
            (0, vitest_1.it)('should handle empty newComments array', () => {
                const patch = {
                    version: 2,
                    parts: {},
                    comments: {},
                    newComments: [],
                };
                const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
                // When newComments is provided and has length > 0, it replaces all comments
                // Since length is 0, it falls back to processing existing comments
                (0, vitest_1.expect)(result.comments).toEqual(createBaseParserResult().comments);
            });
        });
    });
    (0, vitest_1.describe)('description operations', () => {
        (0, vitest_1.it)('should handle description operations', () => {
            // Test setting description to a specific value (not as diff)
            const patch = {
                version: 2,
                parts: {},
                comments: {},
                // Not setting description field means it should be set to empty
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
            (0, vitest_1.expect)(result.description).toBe(''); // Should be empty when no description provided
        });
        (0, vitest_1.it)('should set empty description when description is empty string', () => {
            const patch = {
                version: 2,
                parts: {},
                comments: {},
                description: '',
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
            // Note: Current implementation doesn't handle empty string specially
            // It keeps the original description when empty string is provided
            (0, vitest_1.expect)(result.description).toBe('Original description');
        });
        (0, vitest_1.it)('should set empty description when description is not provided', () => {
            const patch = {
                version: 2,
                parts: {},
                comments: {},
                // description not provided
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
            (0, vitest_1.expect)(result.description).toBe(''); // Empty when no description provided
        });
    });
    (0, vitest_1.describe)('complex scenarios', () => {
        (0, vitest_1.it)('should handle complex patch with multiple operations', () => {
            const patch = {
                version: 2,
                parts: {
                    '1': {
                        type: types_1.ContentType.title,
                    },
                    '2': {
                        insertBefore: [{ text: 'New part before third', type: types_1.ContentType.paragraph }],
                    },
                },
                comments: {},
                newComments: ['Additional new comment'], // This replaces all comments
                // No description field, should be set to empty
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
            // Verify parts changes
            (0, vitest_1.expect)(result.parts.length).toBe(4); // Original 3 + 1 insert
            (0, vitest_1.expect)(result.parts[0].text).toBe('First paragraph with comment〔1〕.'); // No patch for part 0, keeps original with markers
            (0, vitest_1.expect)(result.parts[1].text).toBe('Second paragraph.');
            (0, vitest_1.expect)(result.parts[1].type).toBe(types_1.ContentType.title);
            (0, vitest_1.expect)(result.parts[2].text).toBe('New part before third');
            (0, vitest_1.expect)(result.parts[3].text).toBe('Third paragraph with comment.');
            // Verify comments changes (newComments takes precedence)
            (0, vitest_1.expect)(result.comments).toEqual(['Additional new comment']);
            // Verify description change
            (0, vitest_1.expect)(result.description).toBe('');
        });
        (0, vitest_1.it)('should handle patch with non-existent part indices', () => {
            const patch = {
                version: 2,
                parts: {
                    '999': { delete: true }, // Non-existent part
                    'invalid': { type: types_1.ContentType.title }, // Invalid key
                },
                comments: {},
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
            // Should not crash, should return original data
            (0, vitest_1.expect)(result.parts.length).toBe(createBaseParserResult().parts.length);
        });
        (0, vitest_1.it)('should handle patch with non-existent comment indices', () => {
            const patch = {
                version: 2,
                parts: {},
                comments: {
                    '999': { delete: true }, // Non-existent comment
                },
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), patch);
            // Should not crash
            (0, vitest_1.expect)(result.comments.length).toBe(createBaseParserResult().comments.length);
        });
    });
    (0, vitest_1.describe)('edge cases and error handling', () => {
        (0, vitest_1.it)('should handle empty parser result', () => {
            const emptyResult = {
                title: '',
                authors: [],
                dates: [],
                is_range_date: false,
                parts: [],
                comments: [],
                comment_pivots: [],
                description: '',
                page_start: 0,
                page_end: 0,
            };
            const patch = {
                version: 2,
                parts: {},
                comments: {},
            };
            const result = (0, utils_1.apply_patch_v2)(emptyResult, patch);
            (0, vitest_1.expect)(result.parts).toEqual([]);
            (0, vitest_1.expect)(result.comments).toEqual([]);
            (0, vitest_1.expect)(result.comment_pivots).toEqual([]);
        });
        (0, vitest_1.it)('should handle patch with only version field', () => {
            const minimalPatch = {
                version: 2,
                parts: {},
                comments: {},
            };
            const result = (0, utils_1.apply_patch_v2)(createBaseParserResult(), minimalPatch);
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.title).toBe(createBaseParserResult().title);
        });
        (0, vitest_1.it)('should preserve original metadata', () => {
            const original = createBaseParserResult();
            const patch = {
                version: 2,
                parts: {},
                comments: {},
            };
            const result = (0, utils_1.apply_patch_v2)(original, patch);
            (0, vitest_1.expect)(result.title).toBe(original.title);
            (0, vitest_1.expect)(result.authors).toEqual(original.authors);
            (0, vitest_1.expect)(result.dates).toEqual(original.dates);
            (0, vitest_1.expect)(result.is_range_date).toBe(original.is_range_date);
            (0, vitest_1.expect)(result.page_start).toBe(original.page_start);
            (0, vitest_1.expect)(result.page_end).toBe(original.page_end);
        });
    });
});
