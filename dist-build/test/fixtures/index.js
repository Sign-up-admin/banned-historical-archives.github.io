"use strict";
/**
 * 测试 Fixtures
 * 预定义的测试数据集合，用于在测试中复用
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFixtures = exports.componentFixtures = exports.searchFixtures = exports.tagFixtures = exports.parserResultFixtures = exports.articleFixtures = exports.mockBasicData = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const types_1 = require("../../types");
const data_generators_1 = require("../mocks/data-generators");
/**
 * 基础测试数据
 */
exports.mockBasicData = {
    /** 基础标签 */
    tag: (0, data_generators_1.createMockTag)({
        id: 'tag-001',
        name: '中央文件',
        type: types_1.TagType.articleCategory,
    }),
    /** 基础评论 */
    comment: (0, data_generators_1.createMockComment)({
        index: 0,
        part_idx: 0,
        offset: 10,
        text: '这是一个测试评论',
        id: 'comment-001',
    }),
    /** 基础内容 */
    content: (0, data_generators_1.createMockContent)({
        id: 'content-001',
        type: types_1.ContentType.paragraph,
        text: '这是一个测试段落的内容。',
        index: 0,
    }),
};
/**
 * 文章相关 Fixtures
 */
exports.articleFixtures = {
    /** 基础文章 */
    basic: (0, data_generators_1.createMockArticle)({
        title: '中国共产党中央委员会关于建国以来党的若干历史问题的决议',
        author: ['中共中央'],
        dates: [{ year: 1981, month: 6, day: 27 }],
        is_range_date: false,
        origin: '中共中央文献',
        tags: [
            (0, data_generators_1.createMockTag)({ name: '中央文件', type: types_1.TagType.articleCategory }),
            (0, data_generators_1.createMockTag)({ name: '历史决议', type: types_1.TagType.subject }),
        ],
    }),
    /** 长文章 */
    longArticle: (0, data_generators_1.createMockArticle)({
        title: '中华人民共和国宪法',
        author: ['全国人民代表大会'],
        dates: [{ year: 1982, month: 12, day: 4 }],
        is_range_date: false,
        origin: '全国人大',
        tags: [
            (0, data_generators_1.createMockTag)({ name: '宪法', type: types_1.TagType.articleType }),
            (0, data_generators_1.createMockTag)({ name: '法律文件', type: types_1.TagType.subject }),
        ],
    }),
    /** 毛泽东文章 */
    maoArticle: (0, data_generators_1.createMockArticle)({
        title: '星星之火，可以燎原',
        author: ['毛泽东'],
        dates: [{ year: 1930, month: 1, day: 5 }],
        is_range_date: false,
        origin: '红旗杂志',
        tags: [
            (0, data_generators_1.createMockTag)({ name: '毛泽东', type: types_1.TagType.character }),
            (0, data_generators_1.createMockTag)({ name: '革命理论', type: types_1.TagType.subject }),
            (0, data_generators_1.createMockTag)({ name: '井冈山时期', type: types_1.TagType.place }),
        ],
    }),
    /** 日期范围文章 */
    dateRangeArticle: (0, data_generators_1.createMockArticleWithDateRange)({ year: 1966, month: 5, day: 16 }, { year: 1976, month: 10, day: 6 }, {
        title: '文化大革命时期重要文献集',
        author: ['中共中央'],
        origin: '中共中央文献',
        tags: [
            (0, data_generators_1.createMockTag)({ name: '文化大革命', type: types_1.TagType.subject }),
            (0, data_generators_1.createMockTag)({ name: '历史文献', type: types_1.TagType.articleType }),
        ],
    }),
    /** 多标签文章 */
    multiTagArticle: (0, data_generators_1.createMockArticleWithTags)([
        { name: '中央文件', type: types_1.TagType.articleCategory },
        { name: '毛泽东', type: types_1.TagType.character },
        { name: '周恩来', type: types_1.TagType.character },
        { name: '北京', type: types_1.TagType.place },
        { name: '1960年代', type: types_1.TagType.subject },
    ], {
        title: '中央政治局扩大会议纪要',
        author: ['中共中央'],
        dates: [{ year: 1962, month: 1, day: 11 }],
    }),
    /** 文章列表 */
    articleList: (0, data_generators_1.createMockArticles)(5, (index) => ({
        title: `测试文章 ${index + 1}`,
        author: [`作者${index + 1}`],
        dates: [{ year: 2020 + index, month: 1, day: 1 }],
    })),
};
/**
 * 解析结果相关 Fixtures
 */
exports.parserResultFixtures = {
    /** 基础解析结果 */
    basic: (0, data_generators_1.createMockParserResult)({
        title: '测试文章',
        authors: ['测试作者'],
        dates: [{ year: 2023, month: 12, day: 25 }],
        is_range_date: false,
        parts: [
            (0, data_generators_1.createMockContent)({
                text: '第一段内容，包含一个注释〔1〕。',
                type: types_1.ContentType.paragraph,
                index: 0,
            }),
            (0, data_generators_1.createMockContent)({
                text: '第二段内容。',
                type: types_1.ContentType.paragraph,
                index: 1,
            }),
            (0, data_generators_1.createMockContent)({
                text: '第三段内容，包含另一个注释〔2〕。',
                type: types_1.ContentType.paragraph,
                index: 2,
            }),
        ],
        comments: ['第一个注释的内容', '第二个注释的内容'],
        comment_pivots: [
            { part_idx: 0, index: 0, offset: 15 },
            { part_idx: 2, index: 1, offset: 16 },
        ],
        description: '这是一个测试用的解析结果',
        page_start: 1,
        page_end: 3,
    }),
    /** 复杂解析结果 */
    complex: (0, data_generators_1.createMockParserResultWithContent)([
        '中国共产党是中国工人阶级的先锋队，同时是中国人民和中华民族的先锋队，是中国特色社会主义事业的领导核心。',
        '中国共产党始终代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益。',
        '党的最高理想和最终目标是实现共产主义。',
        '中国共产党以马克思列宁主义、毛泽东思想、邓小平理论、"三个代表"重要思想和科学发展观作为自己的行动指南。',
    ], {
        title: '中国共产党章程（节选）',
        authors: ['中国共产党'],
        dates: [{ year: 2017, month: 10, day: 24 }],
        description: '中国共产党第十九次全国代表大会通过的党章节选',
        page_start: 1,
        page_end: 10,
        origin: '中共中央',
    }),
    /** 带注释的解析结果 */
    withComments: (0, data_generators_1.createMockParserResultWithComments)([
        '这是第一个重要的注释内容。',
        '这是第二个注释，解释了某个历史事件。',
        '这是第三个注释，引用了相关文献。',
    ], {
        title: '历史文献解析结果',
        authors: ['历史学家'],
        parts: [
            (0, data_generators_1.createMockContent)({
                text: '正文第一段〔1〕，包含重要注释。',
                type: types_1.ContentType.paragraph,
                index: 0,
            }),
            (0, data_generators_1.createMockContent)({
                text: '正文第二段〔2〕，另一个注释点。',
                type: types_1.ContentType.paragraph,
                index: 1,
            }),
            (0, data_generators_1.createMockContent)({
                text: '正文第三段〔3〕，最后一个注释。',
                type: types_1.ContentType.paragraph,
                index: 2,
            }),
        ],
    }),
    /** 多页文档 */
    multiPage: (() => {
        const contents = (0, data_generators_1.createMockContents)(3, 2); // 3页，每页2段
        return (0, data_generators_1.createMockParserResult)({
            title: '多页历史文献',
            authors: ['多位作者'],
            parts: contents,
            page_start: 1,
            page_end: 3,
            description: '这是一个跨越多页的历史文献',
        });
    })(),
};
/**
 * 标签相关 Fixtures
 */
exports.tagFixtures = {
    /** 分类标签列表 */
    categories: [
        (0, data_generators_1.createMockTag)({ name: '中央文件', type: types_1.TagType.articleCategory }),
        (0, data_generators_1.createMockTag)({ name: '重要报刊和社论', type: types_1.TagType.articleCategory }),
        (0, data_generators_1.createMockTag)({ name: '关键人物文稿', type: types_1.TagType.articleCategory }),
        (0, data_generators_1.createMockTag)({ name: '群众运动重要文献', type: types_1.TagType.articleCategory }),
    ],
    /** 人物标签列表 */
    characters: [
        (0, data_generators_1.createMockTag)({ name: '毛泽东', type: types_1.TagType.character }),
        (0, data_generators_1.createMockTag)({ name: '周恩来', type: types_1.TagType.character }),
        (0, data_generators_1.createMockTag)({ name: '邓小平', type: types_1.TagType.character }),
        (0, data_generators_1.createMockTag)({ name: '刘少奇', type: types_1.TagType.character }),
    ],
    /** 地点标签列表 */
    places: [
        (0, data_generators_1.createMockTag)({ name: '北京', type: types_1.TagType.place }),
        (0, data_generators_1.createMockTag)({ name: '上海', type: types_1.TagType.place }),
        (0, data_generators_1.createMockTag)({ name: '延安', type: types_1.TagType.place }),
        (0, data_generators_1.createMockTag)({ name: '井冈山', type: types_1.TagType.place }),
    ],
    /** 主题标签列表 */
    subjects: [
        (0, data_generators_1.createMockTag)({ name: '抗日战争', type: types_1.TagType.subject }),
        (0, data_generators_1.createMockTag)({ name: '解放战争', type: types_1.TagType.subject }),
        (0, data_generators_1.createMockTag)({ name: '土地改革', type: types_1.TagType.subject }),
        (0, data_generators_1.createMockTag)({ name: '社会主义建设', type: types_1.TagType.subject }),
    ],
    /** 随机标签列表 */
    randomTags: (0, data_generators_1.createMockTags)(10),
};
/**
 * 搜索和过滤 Fixtures
 */
exports.searchFixtures = {
    /** 搜索结果 */
    searchResults: (0, data_generators_1.createMockArticles)(20, (index) => ({
        title: `搜索结果文章 ${index + 1}`,
        author: [`作者${(index % 5) + 1}`],
        dates: [{ year: 1949 + (index % 50), month: 1, day: 1 }],
        tags: [
            exports.tagFixtures.characters[index % exports.tagFixtures.characters.length],
            exports.tagFixtures.subjects[index % exports.tagFixtures.subjects.length],
        ],
    })),
    /** 过滤后的结果 */
    filteredResults: {
        byAuthor: (0, data_generators_1.createMockArticles)(3, () => ({
            author: ['毛泽东'],
            title: '毛泽东的重要文章',
        })),
        byDate: (0, data_generators_1.createMockArticles)(3, () => ({
            dates: [{ year: 1949, month: 10, day: 1 }],
            title: '1949年重要文献',
        })),
        byTag: (0, data_generators_1.createMockArticles)(3, () => ({
            tags: [(0, data_generators_1.createMockTag)({ name: '中央文件', type: types_1.TagType.articleCategory })],
            title: '中央文件',
        })),
    },
};
/**
 * UI 组件测试 Fixtures
 */
exports.componentFixtures = {
    /** 表单数据 */
    formData: {
        title: '测试标题',
        content: '测试内容',
        author: '测试作者',
        date: '2023-12-25',
        tags: ['历史', '文献'],
    },
    /** 表格数据 */
    tableData: Array.from({ length: 50 }, (_, index) => ({
        id: `row-${index}`,
        title: `表格行 ${index + 1}`,
        author: `作者${(index % 10) + 1}`,
        date: `202${index % 10}-01-01`,
        status: index % 2 === 0 ? 'published' : 'draft',
    })),
    /** 图表数据 */
    chartData: {
        labels: ['1949', '1950', '1951', '1952', '1953'],
        datasets: [
            {
                label: '历史事件数量',
                data: [12, 8, 15, 10, 7],
                backgroundColor: 'rgba(204, 0, 0, 0.6)',
            },
        ],
    },
    /** 导航菜单数据 */
    navigationItems: [
        { label: '首页', path: '/', icon: 'home' },
        { label: '文章', path: '/articles', icon: 'article' },
        { label: '搜索', path: '/search', icon: 'search' },
        { label: '关于', path: '/about', icon: 'info' },
    ],
};
/**
 * 错误和边界情况 Fixtures
 */
exports.errorFixtures = {
    /** 无效数据 */
    invalidData: {
        emptyArticle: (0, data_generators_1.createMockArticle)({
            title: '',
            author: [],
            dates: [],
        }),
        malformedContent: (0, data_generators_1.createMockContent)({
            text: null,
            type: 'invalid',
        }),
        brokenParserResult: (0, data_generators_1.createMockParserResult)({
            title: undefined,
            parts: [],
            comments: [],
            comment_pivots: [{ part_idx: -1, index: -1, offset: -1 }],
        }),
    },
    /** 大数据量 */
    largeData: {
        manyArticles: (0, data_generators_1.createMockArticles)(1000),
        longContent: (0, data_generators_1.createMockParserResultWithContent)(Array.from({ length: 100 }, (_, i) => `第${i + 1}段：${'这是一段很长的文本内容，'.repeat(50)}`), { title: '超长文档' }),
    },
    /** 特殊字符 */
    specialCharacters: {
        unicodeContent: (0, data_generators_1.createMockParserResultWithContent)([
            '包含中文：中国共产党',
            '包含特殊字符：©®™€£¥',
            '包含emoji：🚀⭐🌟',
        ]),
        htmlEntities: (0, data_generators_1.createMockParserResultWithContent)([
            '包含HTML实体：&lt;div&gt;测试&lt;/div&gt;',
            '包含引号："双引号"和\'单引号\'',
        ]),
    },
};
/**
 * 默认导出所有 fixtures
 */
const fixtures = {
    mockBasicData: exports.mockBasicData,
    articleFixtures: exports.articleFixtures,
    parserResultFixtures: exports.parserResultFixtures,
    tagFixtures: exports.tagFixtures,
    searchFixtures: exports.searchFixtures,
    componentFixtures: exports.componentFixtures,
    errorFixtures: exports.errorFixtures,
};
exports.default = fixtures;
