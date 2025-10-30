// 搜索引擎 API 客户端
// 支持 Bing Web Search API 和 Google Custom Search API

/**
 * 搜索引擎配置
 */
const SEARCH_ENGINES = {
  bing: {
    endpoint: 'https://api.bing.microsoft.com/v7.0/search',
    headers: {
      'Ocp-Apim-Subscription-Key': '{{API_KEY}}',
    },
  },
  google: {
    endpoint: 'https://www.googleapis.com/customsearch/v1',
    // Google 需要在 URL 参数中传递 API Key
  },
};

/**
 * 搜索结果标准化接口
 */
class SearchResult {
  constructor(title, url, snippet, displayUrl = null) {
    this.title = title;
    this.url = url;
    this.snippet = snippet;
    this.displayUrl = displayUrl || url;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 搜索引擎客户端
 */
class SearchEngineClient {
  constructor() {
    // 与测试约定保持一致的公开字段
    this.bingApiKey = null;
    this.googleApiKey = null;
    this.googleCseId = null; // Google Custom Search Engine ID
  }

  /**
   * 设置 API 密钥
   * @param {string} engine - 搜索引擎名称 (bing|google)
   * @param {string} apiKey - API 密钥
   * @param {string} cseId - Google CSE ID (仅 Google 需要)
   */
  setApiKey(engine, apiKey, cseId = null) {
    if (engine !== 'bing' && engine !== 'google') {
      throw new Error(`不支持的搜索引擎: ${engine}`);
    }
    if (engine === 'google') {
      if (!cseId) {
        throw new Error('Google 搜索需要提供 Custom Search Engine ID');
      }
      this.googleApiKey = apiKey;
      this.googleCseId = cseId;
    } else if (engine === 'bing') {
      this.bingApiKey = apiKey;
    }
  }

  /**
   * Bing Web Search API
   * @param {string} query - 搜索查询
   * @param {Object} options - 搜索选项
   */
  async searchBing(query, options = {}) {
    if (!this.bingApiKey) {
      throw new Error('未设置 Bing API 密钥');
    }

    const {
      count = 10,
      offset = 0,
      market = 'zh-CN',
      safeSearch = 'Moderate',
      textDecorations = false,
      textFormat = 'Raw',
    } = options;

    const params = new URLSearchParams({
      q: query,
      count: count.toString(),
      offset: offset.toString(),
      mkt: market,
      safeSearch,
      textDecorations: textDecorations.toString(),
      textFormat,
    });

    const response = await fetch(`${SEARCH_ENGINES.bing.endpoint}?${params}`, {
      headers: {
        'Ocp-Apim-Subscription-Key': this.bingApiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bing API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.normalizeBingResults(data);
  }

  /**
   * Google Custom Search API
   * @param {string} query - 搜索查询
   * @param {Object} options - 搜索选项
   */
  async searchGoogle(query, options = {}) {
    if (!this.googleApiKey || !this.googleCseId) {
      throw new Error('未设置 Google API 密钥或 CSE ID');
    }

    const { num = 10, start = 1, lr = 'lang_zh-CN', safe = 'medium', dateRestrict = '' } = options;

    const params = new URLSearchParams({
      key: this.googleApiKey,
      cx: this.googleCseId,
      q: query,
      num: num.toString(),
      start: start.toString(),
      lr,
      safe,
    });

    if (dateRestrict) {
      params.append('dateRestrict', dateRestrict);
    }

    const response = await fetch(`${SEARCH_ENGINES.google.endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`Google API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.normalizeGoogleResults(data);
  }

  /**
   * 多引擎搜索
   * @param {string} query - 搜索查询
   * @param {Array} engines - 搜索引擎列表 ['bing', 'google']
   * @param {Object} options - 搜索选项
   */
  async multiEngineSearch(query, engines = ['bing', 'google'], options = {}) {
    const results = {
      query,
      engines: [],
      results: [],
      errors: [],
      timestamp: new Date().toISOString(),
    };

    const searchPromises = engines.map(async engine => {
      try {
        let searchResults;
        switch (engine) {
          case 'bing':
            searchResults = await this.searchBing(query, options.bing || {});
            break;
          case 'google':
            searchResults = await this.searchGoogle(query, options.google || {});
            break;
          default:
            throw new Error(`不支持的搜索引擎: ${engine}`);
        }

        results.engines.push(engine);
        results.results.push(...searchResults.results.map(r => ({ ...r, source: engine })));

        return { engine, success: true, count: searchResults.results.length };
      } catch (error) {
        results.errors.push({ engine, error: error.message });
        return { engine, success: false, error: error.message };
      }
    });

    await Promise.allSettled(searchPromises);

    // 去重处理（基于 URL）
    const uniqueResults = [];
    const urlSet = new Set();

    for (const result of results.results) {
      if (!urlSet.has(result.url)) {
        urlSet.add(result.url);
        uniqueResults.push(result);
      }
    }

    results.results = uniqueResults;
    results.totalResults = uniqueResults.length;

    return results;
  }

  /**
   * 兼容测试的别名方法：Bing 搜索
   */
  async bingSearch(query, options = {}) {
    return await this.searchBing(query, options);
  }

  /**
   * 兼容测试的别名方法：Google 搜索
   */
  async googleSearch(query, options = {}) {
    return await this.searchGoogle(query, options);
  }

  /**
   * 兼容测试的聚合搜索接口
   * - 校验 query
   * - 空引擎数组直接返回 []
   * - 未知引擎直接抛错
   */
  async searchMultiple(query, engines = ['bing', 'google'], options = {}) {
    if (typeof query !== 'string' || !query.trim()) {
      throw new Error('查询参数无效');
    }

    if (!Array.isArray(engines)) {
      throw new Error('引擎列表必须为数组');
    }

    if (engines.length === 0) {
      return [];
    }

    const supported = new Set(['bing', 'google']);
    for (const eng of engines) {
      if (!supported.has(eng)) {
        throw new Error(`不支持的搜索引擎: ${eng}`);
      }
    }

    const mergedOptions = options || {};
    const result = await this.multiEngineSearch(query, engines, mergedOptions);
    // 返回扁平数组以满足测试的基本断言
    return Array.isArray(result?.results) ? result.results : [];
  }

  /**
   * 标准化 Bing 搜索结果
   * @param {Object} data - Bing API 响应数据
   */
  normalizeBingResults(data) {
    const results = [];

    if (data.webPages && data.webPages.value) {
      for (const item of data.webPages.value) {
        results.push(new SearchResult(item.name, item.url, item.snippet, item.displayUrl));
      }
    }

    return {
      engine: 'bing',
      query: data.queryContext?.originalQuery || '',
      totalEstimated: data.webPages?.totalEstimatedMatches || 0,
      results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 标准化 Google 搜索结果
   * @param {Object} data - Google API 响应数据
   */
  normalizeGoogleResults(data) {
    const results = [];

    if (data.items) {
      for (const item of data.items) {
        results.push(new SearchResult(item.title, item.link, item.snippet, item.displayLink));
      }
    }

    return {
      engine: 'google',
      query: data.queries?.request?.[0]?.searchTerms || '',
      totalEstimated: parseInt(data.searchInformation?.totalResults || '0'),
      results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 智能搜索建议（基于查询优化）
   * @param {string} query - 原始查询
   * @param {string} domain - 专业领域
   */
  generateSearchQueries(query, domain = 'general') {
    const baseQueries = [query];

    // 根据领域添加专业搜索词
    const domainKeywords = {
      tech: ['技术', '开发', 'API', '文档', '教程'],
      business: ['商业', '市场', '分析', '报告', '趋势'],
      academic: ['学术', '论文', '研究', '期刊', '学者'],
      news: ['新闻', '最新', '动态', '报道', '事件'],
      general: ['信息', '详细', '介绍', '概述'],
    };

    const keywords = domainKeywords[domain] || domainKeywords.general;

    // 生成变体查询
    const variations = [
      `${query} ${keywords[0]}`,
      `"${query}"`, // 精确匹配
      `${query} site:github.com`, // 特定站点
      `${query} filetype:pdf`, // 特定文件类型
    ];

    return [...baseQueries, ...variations];
  }
}

// 导出单例实例
const searchEngineClient = new SearchEngineClient();
export default searchEngineClient;

// 也导出类，以便需要多个实例时使用
export { SearchEngineClient, SearchResult };
