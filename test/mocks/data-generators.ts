/**
 * Mock 数据生成器
 * 为测试提供可复用的模拟数据生成函数
 */

import {
  Article,
  ParserResult,
  Content,
  Comment,
  Tag,
  ContentType,
  TagType,
  Date as DateType,
} from '../../types';

/**
 * 创建模拟日期对象
 * @param overrides - 覆盖默认值的对象
 * @returns DateType 对象
 */
export function createMockDate(overrides: Partial<DateType> = {}): DateType {
  return {
    year: 2023,
    month: 12,
    day: 25,
    ...overrides,
  };
}

/**
 * 创建模拟标签对象
 * @param overrides - 覆盖默认值的对象
 * @returns Tag 对象
 */
export function createMockTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: overrides.id || 'mock-tag-id',
    name: '历史文献',
    type: TagType.articleCategory,
    ...overrides,
  };
}

/**
 * 创建模拟评论对象
 * @param overrides - 覆盖默认值的对象
 * @returns Comment 对象
 */
export function createMockComment(overrides: Partial<Comment> = {}): Comment {
  return {
    index: 0,
    part_idx: 0,
    id: overrides.id || 'mock-comment-id',
    offset: 10,
    text: '这是一个测试评论',
    ...overrides,
  };
}

/**
 * 创建模拟内容对象
 * @param overrides - 覆盖默认值的对象
 * @returns Content 对象
 */
export function createMockContent(overrides: Partial<Content> = {}): Content {
  return {
    id: overrides.id || 'mock-content-id',
    type: ContentType.paragraph,
    text: '这是一个测试段落内容。',
    index: 0,
    ...overrides,
  };
}

/**
 * 创建模拟文章对象
 * @param overrides - 覆盖默认值的对象
 * @returns Article 对象
 */
export function createMockArticle(overrides: Partial<Article> = {}): Article {
  return {
    title: '测试文章标题',
    author: ['测试作者'],
    dates: [createMockDate()],
    is_range_date: false,
    origin: '测试来源',
    alias: '测试别名',
    tags: [createMockTag()],
    ...overrides,
  };
}

/**
 * 创建模拟解析结果对象
 * @param overrides - 覆盖默认值的对象
 * @returns ParserResult 对象
 */
export function createMockParserResult(overrides: Partial<ParserResult> = {}): ParserResult {
  return {
    title: '测试文章标题',
    alias: '测试别名',
    dates: [createMockDate()],
    is_range_date: false,
    authors: ['测试作者'],
    parts: [
      createMockContent({ text: '第一段测试内容。', type: ContentType.paragraph, index: 0 }),
      createMockContent({ text: '第二段测试内容。', type: ContentType.paragraph, index: 1 }),
    ],
    comments: ['测试评论1', '测试评论2'],
    comment_pivots: [
      { part_idx: 0, index: 0, offset: 5 },
      { part_idx: 1, index: 1, offset: 3 },
    ],
    description: '这是一个测试描述',
    page_start: 1,
    page_end: 5,
    origin: '测试来源',
    tags: [{ name: '历史文献', type: TagType.articleCategory }],
    file_id: 'test-file-001',
    title_raw: '原始标题',
    date_raw: '2023-12-25',
    parts_raw: [
      { text: '第一段原始内容。', type: ContentType.paragraph },
      { text: '第二段原始内容。', type: ContentType.paragraph },
    ],
    ...overrides,
  };
}

/**
 * 创建具有特定内容的解析结果（用于复杂测试场景）
 * @param content - 自定义内容数组
 * @param overrides - 覆盖默认值的对象
 * @returns ParserResult 对象
 */
export function createMockParserResultWithContent(
  content: string[],
  overrides: Partial<ParserResult> = {}
): ParserResult {
  const parts = content.map((text, index) =>
    createMockContent({
      text,
      type: ContentType.paragraph,
      index,
      id: `content-${index}`,
    })
  );

  return createMockParserResult({
    parts,
    ...overrides,
  });
}

/**
 * 创建包含注释的解析结果（用于注释相关测试）
 * @param commentTexts - 评论文本数组
 * @param overrides - 覆盖默认值的对象
 * @returns ParserResult 对象
 */
export function createMockParserResultWithComments(
  commentTexts: string[],
  overrides: Partial<ParserResult> = {}
): ParserResult {
  const comments = commentTexts;
  const comment_pivots = commentTexts.map((_, index) => ({
    part_idx: Math.floor(index / 2), // 每段最多2个注释
    index,
    offset: 10 + index * 5,
  }));

  return createMockParserResult({
    comments,
    comment_pivots,
    ...overrides,
  });
}

/**
 * 创建多个模拟文章的数组
 * @param count - 要生成的文章数量
 * @param overrides - 每篇文章的覆盖配置
 * @returns Article 数组
 */
export function createMockArticles(
  count: number,
  overrides: (index: number) => Partial<Article> = () => ({})
): Article[] {
  return Array.from({ length: count }, (_, index) =>
    createMockArticle({
      title: `测试文章 ${index + 1}`,
      ...overrides(index),
    })
  );
}

/**
 * 创建多个模拟标签的数组
 * @param count - 要生成的标签数量
 * @param overrides - 每标签的覆盖配置
 * @returns Tag 数组
 */
export function createMockTags(
  count: number,
  overrides: (index: number) => Partial<Tag> = () => ({})
): Tag[] {
  const tagTypes = Object.values(TagType);
  return Array.from({ length: count }, (_, index) =>
    createMockTag({
      name: `测试标签 ${index + 1}`,
      type: tagTypes[index % tagTypes.length],
      ...overrides(index),
    })
  );
}

/**
 * 创建模拟的文章内容数组（用于测试分页等场景）
 * @param pageCount - 页数
 * @param contentPerPage - 每页内容数
 * @returns Content 数组
 */
export function createMockContents(
  pageCount: number = 1,
  contentPerPage: number = 5
): Content[] {
  const contents: Content[] = [];
  let index = 0;

  for (let page = 1; page <= pageCount; page++) {
    for (let i = 0; i < contentPerPage; i++) {
      contents.push(
        createMockContent({
          text: `第${page}页，第${i + 1}段内容。`,
          index: index++,
          id: `content-page${page}-${i}`,
        })
      );
    }
  }

  return contents;
}

/**
 * 创建具有特定日期范围的文章
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @param overrides - 覆盖默认值的对象
 * @returns Article 对象
 */
export function createMockArticleWithDateRange(
  startDate: DateType,
  endDate: DateType,
  overrides: Partial<Article> = {}
): Article {
  return createMockArticle({
    dates: [startDate, endDate],
    is_range_date: true,
    ...overrides,
  });
}

/**
 * 创建具有多种标签类型的文章
 * @param tagOverrides - 标签覆盖配置
 * @param overrides - 文章覆盖配置
 * @returns Article 对象
 */
export function createMockArticleWithTags(
  tagOverrides: Partial<Tag>[] = [],
  overrides: Partial<Article> = {}
): Article {
  const defaultTags = [
    createMockTag({ name: '中央文件', type: TagType.articleCategory }),
    createMockTag({ name: '毛泽东', type: TagType.character }),
    createMockTag({ name: '1966年', type: TagType.place }),
  ];

  const tags = tagOverrides.length > 0
    ? tagOverrides.map((override, index) => createMockTag({ ...defaultTags[index], ...override }))
    : defaultTags;

  return createMockArticle({
    tags,
    ...overrides,
  });
}
