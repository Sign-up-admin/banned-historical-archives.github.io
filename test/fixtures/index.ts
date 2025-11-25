/**
 * 测试 Fixtures
 * 预定义的测试数据集合，用于在测试中复用
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Article,
  ParserResult,
  Content,
  Comment,
  Tag,
  ContentType,
  TagType,
  ArticleType,
} from '../../types';
import {
  createMockArticle,
  createMockParserResult,
  createMockContent,
  createMockComment,
  createMockTag,
  createMockArticles,
  createMockTags,
  createMockContents,
  createMockArticleWithDateRange,
  createMockArticleWithTags,
  createMockParserResultWithContent,
  createMockParserResultWithComments,
} from '../mocks/data-generators';

/**
 * 基础测试数据
 */
export const mockBasicData = {
  /** 基础标签 */
  tag: createMockTag({
    id: 'tag-001',
    name: '中央文件',
    type: TagType.articleCategory,
  }),

  /** 基础评论 */
  comment: createMockComment({
    index: 0,
    part_idx: 0,
    offset: 10,
    text: '这是一个测试评论',
    id: 'comment-001',
  }),

  /** 基础内容 */
  content: createMockContent({
    id: 'content-001',
    type: ContentType.paragraph,
    text: '这是一个测试段落的内容。',
    index: 0,
  }),
};

/**
 * 文章相关 Fixtures
 */
export const articleFixtures = {
  /** 基础文章 */
  basic: createMockArticle({
    title: '中国共产党中央委员会关于建国以来党的若干历史问题的决议',
    author: ['中共中央'],
    dates: [{ year: 1981, month: 6, day: 27 }],
    is_range_date: false,
    origin: '中共中央文献',
    tags: [
      createMockTag({ name: '中央文件', type: TagType.articleCategory }),
      createMockTag({ name: '历史决议', type: TagType.subject }),
    ],
  }),

  /** 长文章 */
  longArticle: createMockArticle({
    title: '中华人民共和国宪法',
    author: ['全国人民代表大会'],
    dates: [{ year: 1982, month: 12, day: 4 }],
    is_range_date: false,
    origin: '全国人大',
    tags: [
      createMockTag({ name: '宪法', type: TagType.articleType }),
      createMockTag({ name: '法律文件', type: TagType.subject }),
    ],
  }),

  /** 毛泽东文章 */
  maoArticle: createMockArticle({
    title: '星星之火，可以燎原',
    author: ['毛泽东'],
    dates: [{ year: 1930, month: 1, day: 5 }],
    is_range_date: false,
    origin: '红旗杂志',
    tags: [
      createMockTag({ name: '毛泽东', type: TagType.character }),
      createMockTag({ name: '革命理论', type: TagType.subject }),
      createMockTag({ name: '井冈山时期', type: TagType.place }),
    ],
  }),

  /** 日期范围文章 */
  dateRangeArticle: createMockArticleWithDateRange(
    { year: 1966, month: 5, day: 16 },
    { year: 1976, month: 10, day: 6 },
    {
      title: '文化大革命时期重要文献集',
      author: ['中共中央'],
      origin: '中共中央文献',
      tags: [
        createMockTag({ name: '文化大革命', type: TagType.subject }),
        createMockTag({ name: '历史文献', type: TagType.articleType }),
      ],
    }
  ),

  /** 多标签文章 */
  multiTagArticle: createMockArticleWithTags(
    [
      { name: '中央文件', type: TagType.articleCategory },
      { name: '毛泽东', type: TagType.character },
      { name: '周恩来', type: TagType.character },
      { name: '北京', type: TagType.place },
      { name: '1960年代', type: TagType.subject },
    ],
    {
      title: '中央政治局扩大会议纪要',
      author: ['中共中央'],
      dates: [{ year: 1962, month: 1, day: 11 }],
    }
  ),

  /** 文章列表 */
  articleList: createMockArticles(5, (index) => ({
    title: `测试文章 ${index + 1}`,
    author: [`作者${index + 1}`],
    dates: [{ year: 2020 + index, month: 1, day: 1 }],
  })),
};

/**
 * 解析结果相关 Fixtures
 */
export const parserResultFixtures = {
  /** 基础解析结果 */
  basic: createMockParserResult({
    title: '测试文章',
    authors: ['测试作者'],
    dates: [{ year: 2023, month: 12, day: 25 }],
    is_range_date: false,
    parts: [
      createMockContent({
        text: '第一段内容，包含一个注释〔1〕。',
        type: ContentType.paragraph,
        index: 0,
      }),
      createMockContent({
        text: '第二段内容。',
        type: ContentType.paragraph,
        index: 1,
      }),
      createMockContent({
        text: '第三段内容，包含另一个注释〔2〕。',
        type: ContentType.paragraph,
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
  complex: createMockParserResultWithContent(
    [
      '中国共产党是中国工人阶级的先锋队，同时是中国人民和中华民族的先锋队，是中国特色社会主义事业的领导核心。',
      '中国共产党始终代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益。',
      '党的最高理想和最终目标是实现共产主义。',
      '中国共产党以马克思列宁主义、毛泽东思想、邓小平理论、"三个代表"重要思想和科学发展观作为自己的行动指南。',
    ],
    {
      title: '中国共产党章程（节选）',
      authors: ['中国共产党'],
      dates: [{ year: 2017, month: 10, day: 24 }],
      description: '中国共产党第十九次全国代表大会通过的党章节选',
      page_start: 1,
      page_end: 10,
      origin: '中共中央',
    }
  ),

  /** 带注释的解析结果 */
  withComments: createMockParserResultWithComments(
    [
      '这是第一个重要的注释内容。',
      '这是第二个注释，解释了某个历史事件。',
      '这是第三个注释，引用了相关文献。',
    ],
    {
      title: '历史文献解析结果',
      authors: ['历史学家'],
      parts: [
        createMockContent({
          text: '正文第一段〔1〕，包含重要注释。',
          type: ContentType.paragraph,
          index: 0,
        }),
        createMockContent({
          text: '正文第二段〔2〕，另一个注释点。',
          type: ContentType.paragraph,
          index: 1,
        }),
        createMockContent({
          text: '正文第三段〔3〕，最后一个注释。',
          type: ContentType.paragraph,
          index: 2,
        }),
      ],
    }
  ),

  /** 多页文档 */
  multiPage: (() => {
    const contents = createMockContents(3, 2); // 3页，每页2段
    return createMockParserResult({
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
export const tagFixtures = {
  /** 分类标签列表 */
  categories: [
    createMockTag({ name: '中央文件', type: TagType.articleCategory }),
    createMockTag({ name: '重要报刊和社论', type: TagType.articleCategory }),
    createMockTag({ name: '关键人物文稿', type: TagType.articleCategory }),
    createMockTag({ name: '群众运动重要文献', type: TagType.articleCategory }),
  ],

  /** 人物标签列表 */
  characters: [
    createMockTag({ name: '毛泽东', type: TagType.character }),
    createMockTag({ name: '周恩来', type: TagType.character }),
    createMockTag({ name: '邓小平', type: TagType.character }),
    createMockTag({ name: '刘少奇', type: TagType.character }),
  ],

  /** 地点标签列表 */
  places: [
    createMockTag({ name: '北京', type: TagType.place }),
    createMockTag({ name: '上海', type: TagType.place }),
    createMockTag({ name: '延安', type: TagType.place }),
    createMockTag({ name: '井冈山', type: TagType.place }),
  ],

  /** 主题标签列表 */
  subjects: [
    createMockTag({ name: '抗日战争', type: TagType.subject }),
    createMockTag({ name: '解放战争', type: TagType.subject }),
    createMockTag({ name: '土地改革', type: TagType.subject }),
    createMockTag({ name: '社会主义建设', type: TagType.subject }),
  ],

  /** 随机标签列表 */
  randomTags: createMockTags(10),
};

/**
 * 搜索和过滤 Fixtures
 */
export const searchFixtures = {
  /** 搜索结果 */
  searchResults: createMockArticles(20, (index) => ({
    title: `搜索结果文章 ${index + 1}`,
    author: [`作者${(index % 5) + 1}`],
    dates: [{ year: 1949 + (index % 50), month: 1, day: 1 }],
    tags: [
      tagFixtures.characters[index % tagFixtures.characters.length],
      tagFixtures.subjects[index % tagFixtures.subjects.length],
    ],
  })),

  /** 过滤后的结果 */
  filteredResults: {
    byAuthor: createMockArticles(3, () => ({
      author: ['毛泽东'],
      title: '毛泽东的重要文章',
    })),

    byDate: createMockArticles(3, () => ({
      dates: [{ year: 1949, month: 10, day: 1 }],
      title: '1949年重要文献',
    })),

    byTag: createMockArticles(3, () => ({
      tags: [createMockTag({ name: '中央文件', type: TagType.articleCategory })],
      title: '中央文件',
    })),
  },
};

/**
 * UI 组件测试 Fixtures
 */
export const componentFixtures = {
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
export const errorFixtures = {
  /** 无效数据 */
  invalidData: {
    emptyArticle: createMockArticle({
      title: '',
      author: [],
      dates: [],
    }),

    malformedContent: createMockContent({
      text: null as any,
      type: 'invalid' as any,
    }),

    brokenParserResult: createMockParserResult({
      title: undefined as any,
      parts: [],
      comments: [],
      comment_pivots: [{ part_idx: -1, index: -1, offset: -1 }],
    }),
  },

  /** 大数据量 */
  largeData: {
    manyArticles: createMockArticles(1000),
    longContent: createMockParserResultWithContent(
      Array.from({ length: 100 }, (_, i) => `第${i + 1}段：${'这是一段很长的文本内容，'.repeat(50)}`),
      { title: '超长文档' }
    ),
  },

  /** 特殊字符 */
  specialCharacters: {
    unicodeContent: createMockParserResultWithContent([
      '包含中文：中国共产党',
      '包含特殊字符：©®™€£¥',
      '包含emoji：🚀⭐🌟',
    ]),

    htmlEntities: createMockParserResultWithContent([
      '包含HTML实体：&lt;div&gt;测试&lt;/div&gt;',
      '包含引号："双引号"和\'单引号\'',
    ]),
  },
};

/**
 * 默认导出所有 fixtures
 */
const fixtures = {
  mockBasicData,
  articleFixtures,
  parserResultFixtures,
  tagFixtures,
  searchFixtures,
  componentFixtures,
  errorFixtures,
};

export default fixtures;
