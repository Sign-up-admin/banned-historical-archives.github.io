/**
 * Mock 数据生成器验证测试
 * 验证 mock 数据生成器是否正常工作
 */

import { describe, it, expect } from 'vitest';
import {
  createMockArticle,
  createMockTag,
  createMockContent,
  createMockComment,
  createMockParserResult,
  createMockDate,
  createMockArticles,
  createMockTags,
  createMockContents,
  createMockArticleWithDateRange,
  createMockArticleWithTags,
  createMockParserResultWithContent,
  createMockParserResultWithComments,
} from './data-generators';
import { TagType, ContentType, ArticleType } from '../../types';

describe('Mock 数据生成器验证 / Mock Data Generators Verification', () => {

  describe('基础数据生成器 / Basic Data Generators', () => {
    it('createMockDate 应该生成有效的日期对象', () => {
      const date = createMockDate();
      expect(date.year).toBe(2023);
      expect(date.month).toBe(12);
      expect(date.day).toBe(25);

      const customDate = createMockDate({ year: 2024, month: 1, day: 1 });
      expect(customDate.year).toBe(2024);
      expect(customDate.month).toBe(1);
      expect(customDate.day).toBe(1);
    });

    it('createMockTag 应该生成有效的标签对象', () => {
      const tag = createMockTag();
      expect(tag.id).toBeDefined();
      expect(tag.name).toBe('历史文献');
      expect(tag.type).toBe(TagType.articleCategory);

      const customTag = createMockTag({
        name: '自定义标签',
        type: TagType.character,
      });
      expect(customTag.name).toBe('自定义标签');
      expect(customTag.type).toBe(TagType.character);
    });

    it('createMockComment 应该生成有效的评论对象', () => {
      const comment = createMockComment();
      expect(comment.id).toBeDefined();
      expect(comment.text).toBe('这是一个测试评论');
      expect(comment.offset).toBe(10);

      const customComment = createMockComment({
        text: '自定义评论',
        offset: 20,
      });
      expect(customComment.text).toBe('自定义评论');
      expect(customComment.offset).toBe(20);
    });

    it('createMockContent 应该生成有效的內容对象', () => {
      const content = createMockContent();
      expect(content.id).toBeDefined();
      expect(content.text).toBe('这是一个测试段落内容。');
      expect(content.type).toBe(ContentType.paragraph);
      expect(content.index).toBe(0);

      const customContent = createMockContent({
        text: '自定义内容',
        type: ContentType.paragraph,
        index: 5,
      });
      expect(customContent.text).toBe('自定义内容');
      expect(customContent.index).toBe(5);
    });
  });

  describe('复杂数据生成器 / Complex Data Generators', () => {
    it('createMockArticle 应该生成有效的文章对象', () => {
      const article = createMockArticle();
      expect(article.title).toBe('测试文章标题');
      expect(article.author).toEqual(['测试作者']);
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.dates).toBeDefined();
      expect(typeof article.is_range_date).toBe('boolean');

      const customArticle = createMockArticle({
        title: '自定义标题',
        author: ['作者A', '作者B'],
      });
      expect(customArticle.title).toBe('自定义标题');
      expect(customArticle.author).toEqual(['作者A', '作者B']);
    });

    it('createMockParserResult 应该生成有效的解析结果对象', () => {
      const result = createMockParserResult();
      expect(result.title).toBe('测试文章标题');
      expect(Array.isArray(result.parts)).toBe(true);
      expect(Array.isArray(result.comments)).toBe(true);
      expect(result.parts.length).toBeGreaterThan(0);
      expect(result.comments.length).toBeGreaterThan(0);
      expect(result.comment_pivots).toBeDefined();
    });

    it('createMockArticleWithDateRange 应该生成带日期范围的文章', () => {
      const startDate = { year: 1949, month: 10, day: 1 };
      const endDate = { year: 1949, month: 10, day: 7 };
      const article = createMockArticleWithDateRange(startDate, endDate);

      expect(article.dates).toHaveLength(2);
      expect(article.dates[0]).toEqual(startDate);
      expect(article.dates[1]).toEqual(endDate);
      expect(article.is_range_date).toBe(true);
    });

    it('createMockArticleWithTags 应该生成带自定义标签的文章', () => {
      const customTags = [
        createMockTag({ name: '标签1', type: TagType.subject }),
        createMockTag({ name: '标签2', type: TagType.character }),
      ];
      const article = createMockArticleWithTags(customTags);

      expect(article.tags).toHaveLength(customTags.length);
      expect(article.tags[0].name).toBe('标签1');
      expect(article.tags[1].name).toBe('标签2');
    });
  });

  describe('批量数据生成器 / Bulk Data Generators', () => {
    it('createMockArticles 应该生成指定数量的文章数组', () => {
      const articles = createMockArticles(5);
      expect(articles).toHaveLength(5);
      articles.forEach((article, index) => {
        expect(article.title).toContain(`测试文章 ${index + 1}`);
        expect(Array.isArray(article.author)).toBe(true);
      });
    });

    it('createMockTags 应该生成指定数量的标签数组', () => {
      const tags = createMockTags(3);
      expect(tags).toHaveLength(3);
      tags.forEach(tag => {
        expect(tag.name).toBeDefined();
        expect(Object.values(TagType)).toContain(tag.type);
      });
    });

    it('createMockContents 应该生成指定数量的内容数组', () => {
      const contents = createMockContents(2, 3);
      expect(contents).toHaveLength(6); // 2页 x 3段
      contents.forEach(content => {
        expect(content.text).toBeDefined();
        expect(typeof content.index).toBe('number');
      });
    });
  });

  describe('带内容生成器 / Content-Enhanced Generators', () => {
    it('createMockParserResultWithContent 应该生成带指定内容的解析结果', () => {
      const contentArray = ['第一段', '第二段', '第三段'];
      const result = createMockParserResultWithContent(contentArray);

      expect(result.parts).toHaveLength(3);
      result.parts.forEach((part, index) => {
        expect(part.text).toBe(contentArray[index]);
        // ContentPart 类型没有 index 属性，只检查 text
      });
    });

    it('createMockParserResultWithComments 应该生成带注释的解析结果', () => {
      const commentTexts = ['注释1', '注释2'];
      const result = createMockParserResultWithComments(commentTexts);

      expect(result.comments).toEqual(commentTexts);
      expect(result.comment_pivots).toHaveLength(commentTexts.length);
    });
  });

  describe('数据一致性验证 / Data Consistency Validation', () => {
    it('生成的数据应该符合 TypeScript 类型要求', () => {
      const article = createMockArticle();
      const tag = createMockTag();
      const content = createMockContent();
      const parserResult = createMockParserResult();

      // 类型检查 - 这些断言确保数据结构正确
      expect(typeof article.title).toBe('string');
      expect(Array.isArray(article.author)).toBe(true);
      expect(typeof tag.type).toBe('string');
      expect(Object.values(TagType)).toContain(tag.type);
      expect(typeof content.type).toBe('string');
      expect(Object.values(ContentType)).toContain(content.type);
      expect(Array.isArray(parserResult.parts)).toBe(true);
      expect(Array.isArray(parserResult.comments)).toBe(true);
    });

    it('所有生成器都应该支持覆盖参数', () => {
      const customOverrides = {
        id: 'custom-id',
        name: 'Custom Name',
        type: TagType.character,
      };

      const tag = createMockTag(customOverrides);
      expect(tag.id).toBe('custom-id');
      expect(tag.name).toBe('Custom Name');
      expect(tag.type).toBe(TagType.character);
    });
  });
});
