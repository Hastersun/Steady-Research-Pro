// 搜索 API 前端客户端
class SearchAPIClient {
  constructor() {
    this.baseUrl = '/api/search';
    this.apiKeys = {
      bing: null,
      google: null,
      googleCseId: null,
    };
  }

  /**
   * 设置 API 密钥
   * @param {Object} keys - API 密钥配置
   */
  async setApiKeys(keys) {
    const { query, ...apiKeyPayload } = keys || {};
    this.apiKeys = { ...this.apiKeys, ...apiKeyPayload };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'config',
          query: query || '__search_config__',
          bingApiKey: apiKeyPayload.bing,
          googleApiKey: apiKeyPayload.google,
          googleCseId: apiKeyPayload.googleCseId,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('设置 API 密钥失败:', error);
      throw error;
    }
  }

  /**
   * 多引擎搜索
   * @param {string} query - 搜索查询
   * @param {Array} engines - 搜索引擎列表
   * @param {Object} options - 搜索选项
   */
  async search(query, engines = ['bing', 'google'], options = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          query,
          engines,
          options,
          apiKeys: this.apiKeys,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('搜索失败:', error);
      throw error;
    }
  }

  /**
   * 搜索配置面板专用的测试调用
   * @param {Object} payload - 测试参数
   * @param {string} payload.query - 测试查询
   * @param {Array} [payload.engines] - 启用的搜索引擎
   * @param {string} [payload.bing]
   * @param {string} [payload.google]
   * @param {string} [payload.googleCseId]
   */
  async testSearch(payload = {}) {
    const { query, engines = [], bing, google, googleCseId } = payload;

    if (!query) {
      throw new Error('缺少测试查询');
    }

    const activeEngines = Array.isArray(engines) && engines.length ? engines : ['bing', 'google'];

    const resolvedKeys = { ...this.apiKeys };
    if (bing !== undefined) resolvedKeys.bing = bing;
    if (google !== undefined) resolvedKeys.google = google;
    if (googleCseId !== undefined) resolvedKeys.googleCseId = googleCseId;
    this.apiKeys = resolvedKeys;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          query,
          engines: activeEngines,
          options: {},
          apiKeys: resolvedKeys,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '搜索失败');
      }

      return result.data?.results || [];
    } catch (error) {
      console.error('测试搜索失败:', error);
      throw error;
    }
  }

  /**
   * Bing 搜索
   * @param {string} query - 搜索查询
   * @param {Object} options - 搜索选项
   */
  async searchBing(query, options = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bing-only',
          query,
          options: { bing: options },
          apiKeys: this.apiKeys,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Bing 搜索失败:', error);
      throw error;
    }
  }

  /**
   * Google 搜索
   * @param {string} query - 搜索查询
   * @param {Object} options - 搜索选项
   */
  async searchGoogle(query, options = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google-only',
          query,
          options: { google: options },
          apiKeys: this.apiKeys,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Google 搜索失败:', error);
      throw error;
    }
  }

  /**
   * 生成搜索查询建议
   * @param {string} query - 原始查询
   * @param {string} domain - 专业领域
   */
  async generateSearchQueries(query, domain = 'general') {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-queries',
          query,
          options: { domain },
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('生成查询建议失败:', error);
      throw error;
    }
  }

  /**
   * 智能研究搜索 - 使用多个相关查询进行全面搜索
   * @param {string} mainQuery - 主要研究查询
   * @param {string} domain - 研究领域
   * @param {Object} options - 搜索选项
   */
  async researchSearch(mainQuery, domain = 'general', options = {}) {
    try {
      // 1. 生成搜索查询变体
      const queryResult = await this.generateSearchQueries(mainQuery, domain);
      if (!queryResult.success) {
        throw new Error('生成查询失败');
      }

      const queries = queryResult.data.suggestions.slice(0, 3); // 限制查询数量
      const allResults = [];
      const searchPromises = queries.map(async (query, index) => {
        // 错开搜索请求以避免API限制
        await new Promise(resolve => setTimeout(resolve, index * 1000));

        return await this.search(query, ['bing', 'google'], {
          bing: { count: 5, ...options.bing },
          google: { num: 5, ...options.google },
        });
      });

      const results = await Promise.allSettled(searchPromises);

      // 汇总结果
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.success) {
          allResults.push(...result.value.data.results);
        }
      }

      // 去重和排序
      const uniqueResults = this.deduplicateResults(allResults);

      return {
        success: true,
        data: {
          query: mainQuery,
          domain,
          totalQueries: queries.length,
          totalResults: uniqueResults.length,
          results: uniqueResults.slice(0, 20), // 限制返回结果数量
          queries: queries,
        },
      };
    } catch (error) {
      console.error('智能研究搜索失败:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 去重搜索结果
   * @param {Array} results - 搜索结果数组
   */
  deduplicateResults(results) {
    const seen = new Set();
    const unique = [];

    for (const result of results) {
      const key = `${result.url}|${result.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(result);
      }
    }

    // 按相关性排序（这里简单按时间排序，实际可以更复杂）
    return unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * 搜索结果过滤和清理
   * @param {Array} results - 搜索结果
   * @param {Object} filters - 过滤条件
   */
  filterResults(results, filters = {}) {
    let filtered = [...results];

    // 按域名过滤
    if (filters.excludeDomains) {
      filtered = filtered.filter(result => {
        const url = new URL(result.url);
        return !filters.excludeDomains.includes(url.hostname);
      });
    }

    // 按关键词过滤
    if (filters.includeKeywords) {
      filtered = filtered.filter(result => {
        const text = `${result.title} ${result.snippet}`.toLowerCase();
        return filters.includeKeywords.some(keyword => text.includes(keyword.toLowerCase()));
      });
    }

    // 按日期过滤（如果有时间戳信息）
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(result => {
        const date = new Date(result.timestamp);
        return date >= start && date <= end;
      });
    }

    return filtered;
  }
}

// 导出单例实例
const searchApiClient = new SearchAPIClient();
export default searchApiClient;

// 也导出类
export { SearchAPIClient };
