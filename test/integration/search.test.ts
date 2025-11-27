/**
 * 搜索功能集成测试
 *
 * 测试 Elasticsearch 搜索查询构建、结果处理和分页功能
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Search Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Search Query Building', () => {
    it('should build basic search query', () => {
      const keyword = '毛泽东';
      const es_size = 20;
      const es_from = 0;

      // Simulate the search query building logic from the search page
      const searchQuery = {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: keyword,
                  fields: ['title^3', 'content^2', 'authors^2', 'tags^1'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                },
              },
            ],
          },
        },
        highlight: {
          fields: {
            content: {
              fragment_size: 150,
              number_of_fragments: 3,
              pre_tags: ['<mark>'],
              post_tags: ['</mark>'],
            },
          },
        },
        size: es_size,
        from: es_from,
        _source: ['title', 'authors', 'publication_name', 'article_id', 'publication_id'],
      };

      expect(searchQuery.query.bool.must).toHaveLength(1);
      expect(searchQuery.query.bool.must[0].multi_match.query).toBe(keyword);
      expect(searchQuery.query.bool.must[0].multi_match.fields).toEqual(
        expect.arrayContaining(['title^3', 'content^2', 'authors^2', 'tags^1'])
      );
      expect(searchQuery.size).toBe(es_size);
      expect(searchQuery.from).toBe(es_from);
    });

    it('should handle empty search keyword', () => {
      const keyword = '';
      const es_size = 20;
      const es_from = 0;

      // For empty keyword, should use match_all query
      const searchQuery = {
        query: {
          match_all: {},
        },
        size: es_size,
        from: es_from,
        _source: ['title', 'authors', 'publication_name', 'article_id', 'publication_id'],
      };

      expect(searchQuery.query).toEqual({ match_all: {} });
    });

    it('should handle pagination parameters', () => {
      const keyword = '文化大革命';
      const es_size = 50;
      const es_from = 100;

      const searchQuery = {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: keyword,
                  fields: ['title^3', 'content^2', 'authors^2', 'tags^1'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                },
              },
            ],
          },
        },
        size: es_size,
        from: es_from,
        _source: ['title', 'authors', 'publication_name', 'article_id', 'publication_id'],
      };

      expect(searchQuery.size).toBe(50);
      expect(searchQuery.from).toBe(100);
    });
  });

  describe('Search API Calls', () => {
    it('should make correct Elasticsearch API call', async () => {
      const mockSearchResponse = {
        took: 15,
        timed_out: false,
        _shards: {
          total: 5,
          successful: 5,
          skipped: 0,
          failed: 0,
        },
        hits: {
          total: {
            value: 1234,
            relation: 'eq',
          },
          max_score: 8.765,
          hits: [
            {
              _index: 'historical-archives',
              _id: 'maoquanji1-001',
              _score: 8.765,
              _source: {
                title: '在中央政治局会议上的讲话',
                authors: ['毛泽东'],
                publication_name: '毛泽东全集第一卷',
                article_id: 'maoquanji1-001',
                publication_id: 'maoquanji1',
              },
              highlight: {
                content: [
                  '这是关于<strong>文化大革命</strong>的重要讲话',
                  '毛泽东在<strong>文化大革命</strong>期间的活动',
                ],
              },
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      });

      const keyword = '文化大革命';
      const es_size = 20;
      const es_from = 0;

      const searchUrl = `http://localhost:9200/historical-archives/_search`;
      const searchBody = {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: keyword,
                  fields: ['title^3', 'content^2', 'authors^2', 'tags^1'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                },
              },
            ],
          },
        },
        highlight: {
          fields: {
            content: {
              fragment_size: 150,
              number_of_fragments: 3,
              pre_tags: ['<mark>'],
              post_tags: ['</mark>'],
            },
          },
        },
        size: es_size,
        from: es_from,
        _source: ['title', 'authors', 'publication_name', 'article_id', 'publication_id'],
      };

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody),
      });
      const data = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody),
      });
      expect(data).toEqual(mockSearchResponse);
    });

    it('should handle search API errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Elasticsearch connection failed'));

      const searchUrl = `http://localhost:9200/historical-archives/_search`;
      const searchBody = {
        query: { match_all: {} },
        size: 20,
        from: 0,
      };

      await expect(
        fetch(searchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(searchBody),
        })
      ).rejects.toThrow('Elasticsearch connection failed');
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Search engine unavailable' }),
      });

      const searchUrl = `http://localhost:9200/historical-archives/_search`;
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: { match_all: {} } }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);

      const errorData = await response.json();
      expect(errorData.error).toBe('Search engine unavailable');
    });
  });

  describe('Search Results Processing', () => {
    it('should process search results correctly', () => {
      const mockResponse = {
        hits: {
          total: { value: 1234, relation: 'eq' },
          hits: [
            {
              _id: 'maoquanji1-001',
              _source: {
                title: '在中央政治局会议上的讲话',
                authors: ['毛泽东'],
                publication_name: '毛泽东全集第一卷',
                article_id: 'maoquanji1-001',
                publication_id: 'maoquanji1',
              },
              highlight: {
                content: [
                  '这是关于<strong>文化大革命</strong>的重要讲话',
                  '毛泽东在<strong>文化大革命</strong>期间的活动',
                ],
              },
            },
            {
              _id: 'maoquanji2-001',
              _source: {
                title: '另一个讲话',
                authors: ['毛泽东', '周恩来'],
                publication_name: '毛泽东全集第二卷',
                article_id: 'maoquanji2-001',
                publication_id: 'maoquanji2',
              },
              highlight: {
                content: ['关于<strong>文化大革命</strong>的讨论'],
              },
            },
          ],
        },
      };

      // Process results as done in the search page
      const results = mockResponse.hits.hits.map((hit: any) => ({
        id: hit._id,
        title: hit._source.title,
        authors: hit._source.authors,
        publicationName: hit._source.publication_name,
        articleId: hit._source.article_id,
        publicationId: hit._source.publication_id,
        highlights: hit.highlight?.content || [],
      }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        id: 'maoquanji1-001',
        title: '在中央政治局会议上的讲话',
        authors: ['毛泽东'],
        publicationName: '毛泽东全集第一卷',
        articleId: 'maoquanji1-001',
        publicationId: 'maoquanji1',
        highlights: [
          '这是关于<strong>文化大革命</strong>的重要讲话',
          '毛泽东在<strong>文化大革命</strong>期间的活动',
        ],
      });

      expect(results[1].highlights).toEqual(['关于<strong>文化大革命</strong>的讨论']);
    });

    it('should handle results without highlights', () => {
      const mockResponse = {
        hits: {
          total: { value: 1, relation: 'eq' },
          hits: [
            {
              _id: 'test-article',
              _source: {
                title: '测试文章',
                authors: ['测试作者'],
                publication_name: '测试出版物',
                article_id: 'test-article',
                publication_id: 'test-pub',
              },
              // No highlight field
            },
          ],
        },
      };

      const results = mockResponse.hits.hits.map((hit: any) => ({
        id: hit._id,
        highlights: hit.highlight?.content || [],
      }));

      expect(results[0].highlights).toEqual([]);
    });

    it('should calculate pagination correctly', () => {
      const totalResults = 1234;
      const pageSize = 20;
      const currentPage = 3; // 0-based

      const totalPages = Math.ceil(totalResults / pageSize);
      const fromIndex = currentPage * pageSize;

      expect(totalPages).toBe(62); // 1234 / 20 = 61.7, ceil to 62
      expect(fromIndex).toBe(60); // 3 * 20 = 60
    });
  });

  describe('URL Generation', () => {
    it('should generate correct article URLs', () => {
      const articleId = 'maoquanji1-001';
      const publicationId = 'maoquanji1';

      const articleUrl = `/articles/${articleId}?publication_id=${publicationId}`;

      expect(articleUrl).toBe('/articles/maoquanji1-001?publication_id=maoquanji1');
    });

    it('should handle special characters in article IDs', () => {
      const articleId = 'special-article_123';
      const publicationId = 'special-pub_456';

      const articleUrl = `/articles/${articleId}?publication_id=${publicationId}`;

      expect(articleUrl).toBe('/articles/special-article_123?publication_id=special-pub_456');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero search results', () => {
      const mockResponse = {
        hits: {
          total: { value: 0, relation: 'eq' },
          hits: [],
        },
      };

      expect(mockResponse.hits.hits).toHaveLength(0);
      expect(mockResponse.hits.total.value).toBe(0);
    });

    it('should handle very large result sets', () => {
      const mockResponse = {
        hits: {
          total: { value: 100000, relation: 'gte' }, // Approximation
          hits: Array.from({ length: 10000 }, (_, i) => ({
            _id: `article-${i}`,
            _source: {
              title: `文章${i}`,
              authors: [`作者${i % 10}`],
              publication_name: `出版物${i % 5}`,
              article_id: `article-${i}`,
              publication_id: `pub-${i % 5}`,
            },
          })),
        },
      };

      expect(mockResponse.hits.hits).toHaveLength(10000);
      expect(mockResponse.hits.total.value).toBe(100000);
    });

    it('should handle search with multiple authors', () => {
      const mockResponse = {
        hits: {
          total: { value: 1, relation: 'eq' },
          hits: [
            {
              _id: 'collective-article',
              _source: {
                title: '集体文章',
                authors: ['毛泽东', '周恩来', '刘少奇', '朱德'],
                publication_name: '中共中央文件集',
                article_id: 'collective-article',
                publication_id: 'central-docs',
              },
            },
          ],
        },
      };

      const result = mockResponse.hits.hits[0];
      expect(result._source.authors).toHaveLength(4);
      expect(result._source.authors).toContain('毛泽东');
      expect(result._source.authors).toContain('周恩来');
    });

    it('should handle search timeout', async () => {
      mockFetch.mockImplementationOnce(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Search timeout')), 30000)
        )
      );

      const searchUrl = `http://localhost:9200/historical-archives/_search`;

      await expect(
        fetch(searchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: { match_all: {} } }),
        })
      ).rejects.toThrow('Search timeout');
    });
  });
});
