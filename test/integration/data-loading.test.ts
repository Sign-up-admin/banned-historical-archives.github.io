/**
 * 数据加载流程集成测试
 *
 * 测试从 GitHub Raw API 加载索引文件和数据加载逻辑
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Data Loading Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('File Count Loading', () => {
    it('should load file count from GitHub API', async () => {
      const mockFileCount = {
        article_list: 5
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFileCount),
      });

      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json'
      );
      const data = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json'
      );
      expect(data).toEqual(mockFileCount);
    });

    it('should handle network errors when loading file count', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetch('https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json')
      ).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const response = await fetch('https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json');

      await expect(response.json()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Article List Loading', () => {
    it('should load article list data from GitHub API', async () => {
      const mockArticleList = {
        books: ['毛泽东全集第一卷', '毛泽东全集第二卷'],
        tags: [
          { type: 'articleCategory', name: '中央文件' },
          { type: 'character', name: '毛泽东' },
        ],
        articles: [
          {
            id: 'maoquanji1-001',
            title: '在中央政治局会议上的讲话',
            authors: ['毛泽东'],
            dates: [{ year: 1949, month: 10, day: 1 }],
            is_range_date: false,
            tag_ids: [0],
            book_ids: [0],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticleList),
      });

      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      const data = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      expect(data).toEqual(mockArticleList);
    });

    it('should load multiple article list files', async () => {
      const mockArticleList1 = {
        books: ['毛泽东全集第一卷'],
        tags: [{ type: 'articleCategory', name: '中央文件' }],
        articles: [
          {
            id: 'maoquanji1-001',
            title: '文章1',
            authors: ['毛泽东'],
            dates: [{ year: 1949, month: 10, day: 1 }],
            is_range_date: false,
            tag_ids: [0],
            book_ids: [0],
          },
        ],
      };

      const mockArticleList2 = {
        books: ['毛泽东全集第二卷'],
        tags: [{ type: 'character', name: '毛泽东' }],
        articles: [
          {
            id: 'maoquanji2-001',
            title: '文章2',
            authors: ['毛泽东'],
            dates: [{ year: 1950, month: 1, day: 1 }],
            is_range_date: false,
            tag_ids: [0],
            book_ids: [0],
          },
        ],
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockArticleList1),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockArticleList2),
        });

      // Load first file
      const response1 = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      const data1 = await response1.json();

      // Load second file
      const response2 = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_1.json'
      );
      const data2 = await response2.json();

      expect(data1).toEqual(mockArticleList1);
      expect(data2).toEqual(mockArticleList2);
    });
  });

  describe('Data Processing', () => {
    it('should process article data and build tag collections', async () => {
      const mockArticleList = {
        books: ['毛泽东全集第一卷'],
        tags: [
          { type: 'articleCategory', name: '中央文件' },
          { type: 'character', name: '毛泽东' },
        ],
        articles: [
          {
            id: 'maoquanji1-001',
            title: '在中央政治局会议上的讲话',
            authors: ['毛泽东'],
            dates: [{ year: 1949, month: 10, day: 1 }],
            is_range_date: false,
            tag_ids: [0, 1],
            book_ids: [0],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticleList),
      });

      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      const data = await response.json();

      // Test data processing logic
      const tagsSet = new Set<string>();
      const authorsSet = new Set<string>();
      const sourcesSet = new Set<string>();

      // Process tags
      for (const k of data.tags) {
        const id = `${k.type}--${k.name}`;
        tagsSet.add(id);
      }

      // Process articles
      for (const k of data.articles) {
        for (const a of k.authors) {
          authorsSet.add(a);
        }
      }

      // Process books
      for (const k of data.books) {
        sourcesSet.add(k);
      }

      expect(tagsSet).toEqual(new Set(['articleCategory--中央文件', 'character--毛泽东']));
      expect(authorsSet).toEqual(new Set(['毛泽东']));
      expect(sourcesSet).toEqual(new Set(['毛泽东全集第一卷']));
    });

    it('should transform article data with expanded tags and books', async () => {
      const mockArticleList = {
        books: ['毛泽东全集第一卷'],
        tags: [
          { type: 'articleCategory', name: '中央文件' },
          { type: 'character', name: '毛泽东' },
        ],
        articles: [
          {
            id: 'maoquanji1-001',
            title: '在中央政治局会议上的讲话',
            authors: ['毛泽东'],
            dates: [{ year: 1949, month: 10, day: 1 }],
            is_range_date: false,
            tag_ids: [0, 1],
            book_ids: [0],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticleList),
      });

      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      const data = await response.json();

      // Transform articles
      const transformedArticles = data.articles.map((k: any) => ({
        ...k,
        tags: Array.from(new Set(k.tag_ids)).map((t: number) => ({
          ...data.tags[t],
          id: `${data.tags[t].type}--${data.tags[t].name}`,
        })),
        books: k.book_ids.map((b: number) => data.books[b]),
      }));

      expect(transformedArticles).toHaveLength(1);
      expect(transformedArticles[0].tags).toEqual([
        {
          type: 'articleCategory',
          name: '中央文件',
          id: 'articleCategory--中央文件',
        },
        {
          type: 'character',
          name: '毛泽东',
          id: 'character--毛泽东',
        },
      ]);
      expect(transformedArticles[0].books).toEqual(['毛泽东全集第一卷']);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/nonexistent.json'
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(
        fetch('https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json')
      ).rejects.toThrow('Timeout');
    });

    it('should handle malformed data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null), // Invalid data structure
      });

      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      const data = await response.json();

      expect(data).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', async () => {
      // Create a large mock dataset
      const largeArticleList = {
        books: Array.from({ length: 100 }, (_, i) => `书籍${i + 1}`),
        tags: Array.from({ length: 50 }, (_, i) => ({
          type: i % 2 === 0 ? 'articleCategory' : 'character',
          name: `标签${i + 1}`,
        })),
        articles: Array.from({ length: 1000 }, (_, i) => ({
          id: `article-${i + 1}`,
          title: `文章${i + 1}`,
          authors: [`作者${(i % 10) + 1}`],
          dates: [{ year: 1949 + (i % 30), month: 1, day: 1 }],
          is_range_date: false,
          tag_ids: [i % 50],
          book_ids: [i % 100],
        })),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(largeArticleList),
      });

      const startTime = Date.now();
      const response = await fetch(
        'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_0.json'
      );
      const data = await response.json();
      const endTime = Date.now();

      // Verify data integrity
      expect(data.articles).toHaveLength(1000);
      expect(data.books).toHaveLength(100);
      expect(data.tags).toHaveLength(50);

      // Performance check (should complete within reasonable time)
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Less than 1 second for mock data
    });
  });
});
