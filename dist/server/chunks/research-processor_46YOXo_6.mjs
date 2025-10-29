import { h as httpApiClient } from './http-api_BwHJ8Hka.mjs';

const STREAM_CAPABLE_PROVIDERS = new Set(['deepseek', 'openai']);

const normalizeSampling = (options = {}) => {
  if (!options || typeof options !== 'object') {
    return {};
  }

  const {
    temperature,
    top_p,
    topP,
    top_k,
    topK,
    presence_penalty,
    presencePenalty,
    frequency_penalty,
    frequencyPenalty,
    max_tokens,
    maxTokens,
  } = options;

  const sampling = {};

  if (typeof temperature === 'number') {
    sampling.temperature = temperature;
  }

  const resolvedTopP =
    typeof top_p === 'number' ? top_p : typeof topP === 'number' ? topP : undefined;
  if (typeof resolvedTopP === 'number') {
    sampling.top_p = resolvedTopP;
  }

  const resolvedTopK =
    typeof top_k === 'number' ? top_k : typeof topK === 'number' ? topK : undefined;
  if (typeof resolvedTopK === 'number') {
    sampling.top_k = resolvedTopK;
  }

  const resolvedPresence =
    typeof presence_penalty === 'number'
      ? presence_penalty
      : typeof presencePenalty === 'number'
        ? presencePenalty
        : undefined;
  if (typeof resolvedPresence === 'number') {
    sampling.presence_penalty = resolvedPresence;
  }

  const resolvedFrequency =
    typeof frequency_penalty === 'number'
      ? frequency_penalty
      : typeof frequencyPenalty === 'number'
        ? frequencyPenalty
        : undefined;
  if (typeof resolvedFrequency === 'number') {
    sampling.frequency_penalty = resolvedFrequency;
  }

  const resolvedMaxTokens =
    typeof max_tokens === 'number'
      ? max_tokens
      : typeof maxTokens === 'number'
        ? maxTokens
        : undefined;
  if (typeof resolvedMaxTokens === 'number') {
    sampling.maxTokens = resolvedMaxTokens;
  }

  return sampling;
};

const buildChatMessages = (messages = [], fallback) => {
  if (Array.isArray(messages) && messages.length) {
    return messages
      .filter(message => message && typeof message === 'object')
      .map(message => ({
        role: typeof message.role === 'string' ? message.role : 'user',
        content: typeof message.content === 'string' ? message.content : '',
      }))
      .filter(message => message.content.length > 0);
  }

  return [];
};

const joinMessages = (messages = [], fallback) => {
  if (Array.isArray(messages) && messages.length) {
    return messages
      .map(message => {
        if (!message) return '';
        if (typeof message === 'string') return message;
        const role = typeof message.role === 'string' ? message.role : 'user';
        const content = typeof message.content === 'string' ? message.content : '';
        return `${role}: ${content}`.trim();
      })
      .filter(Boolean)
      .join('\n');
  }
  return '';
};

class HttpLLMClient {
  constructor(provider, client = httpApiClient) {
    if (!provider || typeof provider !== 'string') {
      throw new Error('HttpLLMClient requires a provider name');
    }
    this.provider = provider;
    this.client = client;
    this.streamCapable = STREAM_CAPABLE_PROVIDERS.has(provider);
  }

  get samplingDefaults() {
    return {
      temperature: 0.7,
      top_p: 0.85,
    };
  }

  async generate(model, prompt, options = {}) {
    const sampling = {
      ...this.samplingDefaults,
      ...normalizeSampling(options),
    };

    return await this.client.sendRequest(prompt, {
      service: this.provider,
      model,
      sampling,
      mode: 'generate',
    });
  }

  async generateStream(model, prompt, callback, options = {}) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('generateStream requires a callback');
    }

    const sampling = {
      ...this.samplingDefaults,
      ...normalizeSampling(options),
    };

    if (!this.streamCapable || typeof this.client.sendStreamingRequest !== 'function') {
      try {
        const response = await this.generate(model, prompt, sampling);
        if (response) {
          callback(response, false);
        }
        callback('', true);
      } catch (error) {
        callback('', true, error);
      }
      return;
    }

    try {
      await this.client.sendStreamingRequest(
        prompt,
        {
          service: this.provider,
          model,
          sampling,
          mode: 'generate',
        },
        chunk => {
          if (chunk) {
            callback(chunk, false);
          }
        }
      );
      callback('', true);
    } catch (error) {
      callback('', true, error);
    }
  }

  async chat(model, messages, options = {}) {
    const sampling = {
      ...this.samplingDefaults,
      ...normalizeSampling(options),
    };

    const payloadMessages = buildChatMessages(messages);
    const fallbackPrompt = joinMessages(messages);

    return await this.client.sendRequest(fallbackPrompt, {
      service: this.provider,
      model,
      sampling,
      mode: 'chat',
      messages: payloadMessages,
    });
  }

  async chatStream(model, messages, callback, options = {}) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('chatStream requires a callback');
    }

    const sampling = {
      ...this.samplingDefaults,
      ...normalizeSampling(options),
    };

    const payloadMessages = buildChatMessages(messages);
    const fallbackPrompt = joinMessages(messages);

    if (!this.streamCapable || typeof this.client.sendStreamingRequest !== 'function') {
      try {
        const response = await this.client.sendRequest(fallbackPrompt, {
          service: this.provider,
          model,
          sampling,
          mode: 'chat',
          messages: payloadMessages,
        });
        if (response) {
          callback(response, false);
        }
        callback('', true);
      } catch (error) {
        callback('', true, error);
      }
      return;
    }

    try {
      await this.client.sendStreamingRequest(
        fallbackPrompt,
        {
          service: this.provider,
          model,
          sampling,
          mode: 'chat',
          messages: payloadMessages,
        },
        chunk => {
          if (chunk) {
            callback(chunk, false);
          }
        }
      );
      callback('', true);
    } catch (error) {
      callback('', true, error);
    }
  }
}

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

// 通用 Agent 基类，用于深度研究工作流
class BaseAgent {
  /**
   * @param {object} options
   * @param {string} options.name - Agent 标识
   * @param {object} [options.llmClient] - LLM 客户端实例，需实现 generate/chat 及对应的 stream 方法
   * @param {object} [options.config] - 默认配置（模型、采样参数等）
   */
  constructor({ name, llmClient = null, config = {} } = {}) {
    if (!name) {
      throw new Error('BaseAgent 需要提供 name');
    }

    this.name = name;
    this.llm = llmClient;
    this.config = {
      model: config.model || '',
      sampling: {
        temperature: config?.sampling?.temperature ?? 0.3,
        topP: config?.sampling?.topP ?? 0.85,
        ...config?.sampling,
      },
      ...config,
    };
  }

  /**
   * 运行 Agent 的主流程。子类必须实现。
   * @param {object} payload
   * @param {object} runtime
   */
  // eslint-disable-next-line class-methods-use-this
  async run(payload, runtime) {
    throw new Error(`[${this.name}] run() 未实现`);
  }

  /**
   * 返回默认模型，子类可覆盖。
   */
  getDefaultModel() {
    return this.config.model || 'llama3:8b';
  }

  /**
   * 合并默认采样参数与 overrides。
   */
  getSamplingOptions(overrides = {}) {
    return {
      ...this.config.sampling,
      ...overrides,
    };
  }

  /**
   * 判断是否支持流式输出。
   */
  supportsStreaming() {
    return Boolean(this.llm?.generateStream) || Boolean(this.llm?.chatStream);
  }

  /**
   * 统一的 LLM 调用入口。
   * @param {object} params
   * @param {string} [params.mode='generate'] - generate | chat
   * @param {string} [params.model]
   * @param {string} [params.prompt]
   * @param {Array} [params.messages]
   * @param {boolean} [params.stream=false]
   * @param {function} [params.onToken] - 流式 token 回调
   * @param {object} [params.options] - 采样参数覆盖
   */
  async invokeLLM({
    mode = 'generate',
    model,
    prompt = '',
    messages = [],
    stream = false,
    onToken,
    options = {},
  } = {}) {
    if (!this.llm) {
      throw new Error(`[${this.name}] 尚未注入 llmClient`);
    }

    const resolvedModel = model || this.getDefaultModel();
    const sampling = this.getSamplingOptions(options);

    if (stream && typeof onToken === 'function') {
      const handler = (chunk, done, error) => {
        onToken({ chunk, done, error });
      };

      if (mode === 'chat') {
        if (typeof this.llm.chatStream !== 'function') {
          throw new Error(`[${this.name}] 当前 llmClient 不支持 chatStream`);
        }
        await this.llm.chatStream(resolvedModel, messages, handler, sampling);
      } else {
        if (typeof this.llm.generateStream !== 'function') {
          throw new Error(`[${this.name}] 当前 llmClient 不支持 generateStream`);
        }
        await this.llm.generateStream(resolvedModel, prompt, handler, sampling);
      }
      return null;
    }

    if (mode === 'chat') {
      if (typeof this.llm.chat !== 'function') {
        throw new Error(`[${this.name}] 当前 llmClient 不支持 chat`);
      }
      return this.llm.chat(resolvedModel, messages, sampling);
    }

    if (typeof this.llm.generate !== 'function') {
      throw new Error(`[${this.name}] 当前 llmClient 不支持 generate`);
    }
    return this.llm.generate(resolvedModel, prompt, sampling);
  }

  /**
   * 序列化运行状态，用于缓存/恢复。
   */
  serialize(state = {}) {
    return {
      name: this.name,
      config: this.config,
      state,
    };
  }

  /**
   * 子类可实现恢复逻辑。
   */
  static deserialize() {
    throw new Error('deserialize() 需在子类中实现');
  }
}

// 通用辅助函数，供多代理工作流使用

/**
 * 从 LLM 返回的文本中提取 JSON 数据。
 * 会尝试解析 ```json``` 代码块或首个 JSON 片段。
 * @param {string} text
 * @returns {any | null}
 */
function extractJson(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fencedMatch ? fencedMatch[1] : text;

  const startIndex = raw.search(/[\[{]/);
  if (startIndex === -1) {
    return null;
  }

  const trimmed = raw.slice(startIndex).trim();

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    // 尝试去除尾随字符后再次解析
    const lastBrace = trimmed.lastIndexOf('}');
    const lastBracket = trimmed.lastIndexOf(']');
    const cutIndex = Math.max(lastBrace, lastBracket);
    if (cutIndex > 0) {
      try {
        return JSON.parse(trimmed.slice(0, cutIndex + 1));
      } catch (error2) {
        console.warn('[agents] JSON parse retry failed', error2);
      }
    }
    console.warn('[agents] JSON parse failed', error);
    return null;
  }
}

/**
 * 生成简单的 Markdown 大纲，提取一级和二级标题。
 * @param {string} markdown
 * @returns {Array<{ heading: string, level: number, bullets: string[] }>}
 */
function buildOutline(markdown = '') {
  if (typeof markdown !== 'string' || !markdown.trim()) {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const outline = [];
  let current = null;

  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();
      current = { heading, level, bullets: [] };
      outline.push(current);
      return;
    }

    if (current && line.trim().startsWith('-')) {
      const bullet = line.replace(/^-\s*/, '').trim();
      if (bullet) {
        current.bullets.push(bullet);
      }
    }
  });

  return outline;
}

/**
 * 限制字符串长度，避免提示词过长。
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
function truncate(text, max = 4000) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}\n...\n[truncated ${text.length - max} chars]`;
}

const DEFAULT_ENGINES = ['bing', 'google'];
const DEFAULT_ENGINE_OPTIONS = {
  bing: { count: 5, market: 'zh-CN' },
  google: { num: 5, lr: 'lang_zh-CN' },
};

const stripBullet = line => line.replace(/^[-*•\d\.\)\s]+/, '').trim();

const deduplicateByUrl = (results = []) => {
  const seen = new Set();
  const unique = [];
  for (const item of results) {
    const url = item.url || item.link;
    if (!url) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push({ ...item, url });
  }
  return unique;
};

const toEvidenceNotes = (rawResults, summary) => {
  if (Array.isArray(summary?.notes) && summary.notes.length) {
    return summary.notes.map((note, index) => ({
      summary: note.summary || note.point || '',
      evidence: Array.isArray(note.evidence) ? note.evidence : [],
      topic: note.topic || note.theme || '',
      sourceUrl: note.sourceUrl || note.url || rawResults[index]?.url || '',
      engine: note.engine || rawResults[index]?.engine || '',
      confidence: typeof note.confidence === 'number' ? note.confidence : undefined,
    }));
  }

  // fallback：直接使用搜索结果生成初步笔记
  return rawResults.slice(0, 8).map(result => ({
    summary: result.snippet || result.description || result.title || '',
    evidence: [
      {
        quote: result.snippet || '',
        source: result.url,
        confidence: 0.5,
      },
    ],
    topic: result.title || '',
    sourceUrl: result.url,
    engine: result.engine || 'search',
  }));
};

class SearchAgent extends BaseAgent {
  constructor({ llmClient, config = {}, searchClient = searchApiClient } = {}) {
    super({ name: 'SearchAgent', llmClient, config });
    this.searchClient = searchClient;
  }

  /**
   * @param {object} payload
   * @param {string} payload.query
   * @param {object} [payload.config]
   * @param {string[]} [payload.config.engines]
   * @param {object} [payload.config.engineOptions]
   * @param {number} [payload.config.maxResults]
   * @param {number} [payload.config.maxQueries]
   * @param {object} [payload.config.apiKeys]
   * @param {object} [payload.previous]
   * @param {object} runtime
   */
  async run(payload = {}, runtime = {}) {
    const startedAt = Date.now();
    const { query, config = {}, previous = {} } = payload;

    if (!query) {
      throw new Error('[SearchAgent] 缺少 query');
    }

    const {
      engines = DEFAULT_ENGINES,
      engineOptions = {},
      maxResults = 15,
      maxQueries = 4,
      apiKeys,
      model: overrideModel,
    } = config;

    if (apiKeys) {
      await this.searchClient.setApiKeys(apiKeys);
    }

    const resolvedModel = overrideModel || runtime.model || this.getDefaultModel();
    const sampling = this.getSamplingOptions({ ...runtime.sampling, ...config.sampling });

    const planSummary = previous?.plan?.content ? truncate(previous.plan.content, 800) : '';

    const strategyPrompt = `你是一名信息检索专家，需要为如下研究问题规划检索策略：

研究问题：${query}
${
  planSummary
    ? `
研究计划概要：
${planSummary}
`
    : ''
}
请输出 JSON，包含字段：
- primaryQuery: 最核心的检索语句（字符串）
- queries: 覆盖多维度的检索语句数组（3-5 个）
- notes: 关于检索策略的说明（字符串）
- focusAreas: 关注重点数组

严格返回 JSON。`;

    let strategyJson = null;
    let strategyText = '';

    try {
      strategyText = await this.invokeLLM({
        model: resolvedModel,
        prompt: strategyPrompt,
        options: sampling,
      });
      strategyJson = extractJson(strategyText);
    } catch (error) {
      const uniqueResults = deduplicateByUrl(searchResults).slice(0, maxResults);

      searchErrors.length && searchResults.length === 0;
      uniqueResults.length === 0;
    }

    const primaryQuery = strategyJson?.primaryQuery?.trim() || query;
    const rawQueries = Array.isArray(strategyJson?.queries) ? strategyJson.queries : [];

    const formattedQueries = rawQueries
      .map(item => stripBullet(String(item || '')))
      .filter(Boolean)
      .slice(0, maxQueries);

    if (!formattedQueries.includes(primaryQuery)) {
      formattedQueries.unshift(primaryQuery);
    }

    if (!formattedQueries.length) {
      formattedQueries.push(query);
    }

    const searchResults = [];
    const searchErrors = [];

    for (let i = 0; i < formattedQueries.length; i += 1) {
      const searchQuery = formattedQueries[i];
      try {
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        const engineOpts = {
          ...DEFAULT_ENGINE_OPTIONS,
          ...(engineOptions || {}),
        };

        const response = await this.searchClient.search(searchQuery, engines, engineOpts);
        if (response?.success) {
          const payloadResults = Array.isArray(response.data?.results) ? response.data.results : [];
          payloadResults.forEach(item => {
            searchResults.push({
              title: item.title,
              snippet: item.snippet || item.description,
              url: item.url || item.link,
              displayUrl: item.displayUrl,
              engine: item.engine || item.source || 'search',
            });
          });
        } else {
          searchErrors.push({ query: searchQuery, error: response?.error || '未知错误' });
        }
      } catch (error) {
        searchErrors.push({ query: searchQuery, error: error.message });
      }
    }

    const uniqueResults = deduplicateByUrl(searchResults).slice(0, maxResults);

    let summaryJson = null;
    if (uniqueResults.length) {
      const condensed = uniqueResults
        .map(
          (item, index) =>
            `${index + 1}. 标题: ${item.title || '无标题'}\n   摘要: ${item.snippet || '无摘要'}\n   来源: ${item.url}`
        )
        .join('\n');

      const summaryPrompt = `以下是与“${query}”相关的搜索结果，请汇总为 JSON：
${truncate(condensed, 3500)}

返回字段：
{
  "notes": [
    {
      "summary": "关键发现",
      "topic": "主题",
      "sourceUrl": "来源链接",
      "engine": "搜索引擎",
      "confidence": 0.0-1.0,
      "evidence": [{"quote": "引用内容", "source": "链接", "confidence": 0.0-1.0 }]
    }
  ],
  "highlights": ["核心洞察"],
  "warnings": ["潜在风险或数据缺口"],
  "metadata": {
    "coverage": "覆盖面说明",
    "novelty": "新颖性"
  }
}

严格输出 JSON。`;

      try {
        const summaryText = await this.invokeLLM({
          model: resolvedModel,
          prompt: summaryPrompt,
          options: sampling,
        });
        summaryJson = extractJson(summaryText);
      } catch (error) {
        console.warn('[SearchAgent] summarization failed', error);
      }
    }

    const finishedAt = Date.now();
    const summarizationFallback = !summaryJson;
    const isFallback = allQueriesFailed || noResultsReturned || summarizationFallback;
    let fallbackReason = null;
    if (allQueriesFailed) fallbackReason = 'api_error';
    else if (noResultsReturned) fallbackReason = 'no_results';
    else if (summarizationFallback) fallbackReason = 'summarize_unavailable';
    const fallbackMessage =
      fallbackReason === 'api_error'
        ? '搜索接口连续失败，使用回退策略'
        : fallbackReason === 'no_results'
          ? '搜索结果为空，提供基础计划作为参考'
          : fallbackReason === 'summarize_unavailable'
            ? '摘要生成失败，展示原始搜索结果'
            : null;

    return {
      strategy: {
        primaryQuery,
        queries: formattedQueries,
        engines,
        notes: strategyJson?.notes || strategyText,
        focusAreas: strategyJson?.focusAreas || [],
      },
      notes: toEvidenceNotes(uniqueResults, summaryJson),
      rawResults: uniqueResults,
      summary: {
        highlights: summaryJson?.highlights || [],
        warnings: summaryJson?.warnings || [],
        metadata: summaryJson?.metadata || {},
      },
      metadata: {
        durationMs: finishedAt - startedAt,
        resultsCount: uniqueResults.length,
        queryCount: formattedQueries.length,
        errors: searchErrors,
        isFallback,
        fallbackReason,
        fallbackMessage,
        coverage: {
          attempted: formattedQueries.length,
          succeeded: searchResults.length,
        },
        warnings: summarizationFallback ? ['summarization_fallback'] : [],
        isApiFallback: allQueriesFailed,
        noResultsReturned,
      },
    };
  }
}

class ModelingAgent extends BaseAgent {
  constructor({ llmClient, config = {} } = {}) {
    super({ name: 'ModelingAgent', llmClient, config });
  }

  /**
   * @param {object} payload
   * @param {string} payload.query
   * @param {Array} payload.evidence
   * @param {object} payload.strategy
   * @param {object} [payload.modelOverride]
   * @param {object} runtime
   */
  async run(payload = {}, runtime = {}) {
    const startedAt = Date.now();
    const { query, evidence = [], strategy = {}, modelOverride } = payload;

    if (!query) {
      throw new Error('[ModelingAgent] 缺少 query');
    }

    const resolvedModel = modelOverride || runtime.model || this.getDefaultModel();
    const sampling = this.getSamplingOptions({ ...runtime.sampling, ...payload.sampling });

    const evidenceSnapshot = evidence
      .slice(0, 12)
      .map(
        (item, index) =>
          `${index + 1}. 摘要: ${truncate(item.summary, 280)}\n   来源: ${item.sourceUrl || 'N/A'}\n   主题: ${item.topic || '未指定'}\n`
      )
      .join('\n');

    const strategyFocus = Array.isArray(strategy?.focusAreas)
      ? strategy.focusAreas.join(', ')
      : strategy?.notes || '';

    const modelingPrompt = `你是一名分析师，根据提供的证据构建研究模型。

研究问题：${query}
策略重点：${truncate(strategyFocus, 400)}

证据清单：
${truncate(evidenceSnapshot, 3600)}

请严格输出 JSON，包含字段：
{
  "modelType": "string",
  "coreDrivers": [
    {"name": "string", "description": "string", "evidenceRefs": [0,1], "weight": 0-1 }
  ],
  "relationships": [
    {"from": "string", "to": "string", "type": "influence|correlation|causal", "confidence": 0-1 }
  ],
  "scenarios": [
    {"name": "string", "assumptions": [""], "outcomes": [""], "confidence": 0-1 }
  ],
  "metrics": [
    {"name": "string", "estimate": number, "unit": "string", "confidence": 0-1 }
  ],
  "risks": ["主要风险"],
  "opportunities": ["关键机会"],
  "metadata": {"method": "string", "coverage": "string"}
}
`;

    let modelJson = null;
    let rawText = '';

    try {
      rawText = await this.invokeLLM({
        model: resolvedModel,
        prompt: modelingPrompt,
        options: sampling,
      });
      modelJson = extractJson(rawText);
    } catch (error) {
      console.warn('[ModelingAgent] modeling prompt failed', error);
    }

    const finishedAt = Date.now();

    if (!modelJson) {
      return {
        modelType: 'knowledge_graph',
        coreDrivers: evidence.slice(0, 5).map((item, index) => ({
          name: item.topic || `要点 ${index + 1}`,
          description: item.summary || '',
          evidenceRefs: [index],
          weight: 0.5,
        })),
        relationships: [],
        scenarios: [],
        metrics: [],
        risks: [],
        opportunities: [],
        metadata: {
          durationMs: finishedAt - startedAt,
          warnings: ['LLM 输出解析失败，已回退至基于证据的简单模型'],
          rawText,
        },
      };
    }

    return {
      modelType: modelJson.modelType || 'causal_graph',
      coreDrivers: Array.isArray(modelJson.coreDrivers) ? modelJson.coreDrivers : [],
      relationships: Array.isArray(modelJson.relationships) ? modelJson.relationships : [],
      scenarios: Array.isArray(modelJson.scenarios) ? modelJson.scenarios : [],
      metrics: Array.isArray(modelJson.metrics) ? modelJson.metrics : [],
      risks: Array.isArray(modelJson.risks) ? modelJson.risks : [],
      opportunities: Array.isArray(modelJson.opportunities) ? modelJson.opportunities : [],
      metadata: {
        durationMs: finishedAt - startedAt,
        method: modelJson.metadata?.method || 'llm_structured_modeling',
        coverage: modelJson.metadata?.coverage || '',
        rawText,
      },
    };
  }
}

const buildSourceList = (evidence = []) => {
  return evidence
    .map((item, index) => ({
      title: item.topic || item.summary?.slice(0, 60) || `来源 ${index + 1}`,
      url: item.sourceUrl || item.url || '',
      noteIndex: index,
    }))
    .filter(source => !!source.url);
};

class ReportAgent extends BaseAgent {
  constructor({ llmClient, config = {} } = {}) {
    super({ name: 'ReportAgent', llmClient, config });
  }

  /**
   * @param {object} payload
   * @param {string} payload.query
   * @param {object} payload.model
   * @param {Array} payload.evidence
   * @param {object} [payload.options]
   * @param {object} runtime
   */
  async run(payload = {}, runtime = {}) {
    const startedAt = Date.now();
    const { query, model: modelBlueprint, evidence = [], options = {}, modelOverride } = payload;

    if (!query) {
      throw new Error('[ReportAgent] 缺少 query');
    }

    const resolvedModel = modelOverride || runtime.model || this.getDefaultModel();
    const sampling = this.getSamplingOptions({ ...runtime.sampling, ...options.sampling });

    const evidenceSummary = evidence
      .slice(0, 10)
      .map(
        (item, index) =>
          `${index + 1}. 主题: ${item.topic || 'N/A'}\n   发现: ${truncate(item.summary, 220)}\n   来源: ${item.sourceUrl || '未知'}\n`
      )
      .join('\n');

    const modelDigest = modelBlueprint
      ? JSON.stringify(
          {
            modelType: modelBlueprint.modelType,
            coreDrivers: modelBlueprint.coreDrivers?.slice(0, 5),
            relationships: modelBlueprint.relationships?.slice(0, 5),
            scenarios: modelBlueprint.scenarios?.slice(0, 3),
          },
          null,
          2
        )
      : '';

    const format = options.format || 'markdown';
    const audience = options.audience || 'executive';

    const reportPrompt = `你是一名资深研究顾问，需要基于以下信息撰写报告：

研究问题：${query}
目标读者：${audience}
输出格式：${format}

模型蓝图（JSON）：
${truncate(modelDigest, 2200)}

核心证据：
${truncate(evidenceSummary, 3200)}

请生成一个结构化的 Markdown 报告，至少包含：
1. 执行摘要
2. 关键洞察（列表）
3. 趋势与预测
4. 风险与机会
5. 建议行动
6. 引用来源（引用格式：[来源名称](链接)）

报告要求：
- 用中文撰写。
- 明确引用证据（可按 [#1] 标注，对应上方证据编号）。
- 语言简洁有逻辑，适合业务决策者阅读。
`;

    const chunks = [];
    const supportsStreaming = runtime.onToken && this.supportsStreaming();
    let markdown = '';

    if (supportsStreaming) {
      await this.invokeLLM({
        model: resolvedModel,
        prompt: reportPrompt,
        stream: true,
        onToken: ({ chunk, done, error }) => {
          if (error) {
            runtime.onToken?.({ chunk: '', done: true, error });
            return;
          }
          if (chunk) {
            chunks.push(chunk);
            runtime.onToken?.({ chunk, done: false });
          }
          if (done) {
            runtime.onToken?.({ chunk: '', done: true });
          }
        },
        options: sampling,
      });
      markdown = chunks.join('');
    } else {
      markdown = await this.invokeLLM({
        model: resolvedModel,
        prompt: reportPrompt,
        options: sampling,
      });
    }

    const finishedAt = Date.now();
    const outline = buildOutline(markdown);
    const sources = buildSourceList(evidence);

    return {
      markdown,
      outline,
      sources,
      metadata: {
        durationMs: finishedAt - startedAt,
        streamed: Boolean(supportsStreaming),
        format,
        audience,
      },
    };
  }
}

const DEFAULT_SAMPLING = {
  temperature: 0.3,
  topP: 0.85,
};

const STEP_MODEL_KEYS = {
  search: 'search',
  modeling: 'modeling',
  report: 'report',
};

const clampNumber = (value, min, max, fallback) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
};

const ensureString = (value, fallback = '') => {
  return typeof value === 'string' && value.trim().length ? value.trim() : fallback;
};

class ResearchTaskProcessor {
  constructor({ llmClient = null, searchClient = null, agents = {} } = {}) {
    this.baseLLMClient = llmClient;
    this.searchClient = searchClient || searchApiClient;
    this.agents = {
      searchAgent: agents.searchAgent || null,
      modelingAgent: agents.modelingAgent || null,
      reportAgent: agents.reportAgent || null,
    };

    this.status = {
      isProcessing: false,
      currentStep: null,
      startedAt: null,
      finishedAt: null,
      completedSteps: [],
    };

    this.abortRequested = false;
  }

  getProcessingStatus() {
    return {
      isProcessing: this.status.isProcessing,
      currentStep: this.status.currentStep,
      startedAt: this.status.startedAt,
      finishedAt: this.status.finishedAt,
      completedSteps: [...this.status.completedSteps],
    };
  }

  stopProcessing() {
    this.abortRequested = true;
  }

  resolveDeepAgentConfig(overrides = {}, fallbackModel) {
    const baseModel = ensureString(fallbackModel, 'llama3:8b');
    const baseConfig = {
      enabled: false,
      models: {
        search: baseModel,
        modeling: baseModel,
        report: baseModel,
      },
      sampling: { ...DEFAULT_SAMPLING },
      providerMapping: { enabled: false },
    };

    if (!overrides || typeof overrides !== 'object') {
      return baseConfig;
    }

    const explicitModels =
      typeof overrides.models === 'object' && overrides.models ? overrides.models : {};

    const mapping =
      typeof overrides.providerMapping === 'object' && overrides.providerMapping
        ? overrides.providerMapping
        : {};

    const mappingEnabled = Boolean(mapping.enabled);

    const resolvedModels = {
      search:
        ensureString(explicitModels.search, mappingEnabled ? mapping.search : baseModel) ||
        baseModel,
      modeling:
        ensureString(explicitModels.modeling, mappingEnabled ? mapping.modeling : baseModel) ||
        baseModel,
      report:
        ensureString(explicitModels.report, mappingEnabled ? mapping.report : baseModel) ||
        baseModel,
    };

    const rawSampling =
      typeof overrides.sampling === 'object' && overrides.sampling ? overrides.sampling : {};

    const resolvedSampling = {
      temperature: clampNumber(rawSampling.temperature, 0, 2, DEFAULT_SAMPLING.temperature),
      topP: clampNumber(rawSampling.topP ?? rawSampling.top_p, 0, 1, DEFAULT_SAMPLING.topP),
    };

    const enabled = overrides.enabled ?? mappingEnabled ?? baseConfig.enabled;

    return {
      ...baseConfig,
      ...overrides,
      enabled: Boolean(enabled),
      models: resolvedModels,
      sampling: resolvedSampling,
      providerMapping: {
        ...baseConfig.providerMapping,
        ...mapping,
        enabled: Boolean(mappingEnabled),
      },
    };
  }

  buildExecutionContext(topic, baseModel, task = {}, deepAgentOverrides = {}, runtime = {}) {
    const resolvedTopic = ensureString(topic);
    if (!resolvedTopic) {
      throw new Error('ResearchTaskProcessor 需要有效的研究主题');
    }

    const deepAgent = this.resolveDeepAgentConfig(deepAgentOverrides, baseModel);

    return {
      topic: resolvedTopic,
      baseModel: ensureString(baseModel, deepAgent.models.report),
      task: task && typeof task === 'object' ? { ...task } : {},
      deepAgent,
      runtime: {
        llmClient: runtime.llmClient || null,
        searchClient: runtime.searchClient || this.searchClient,
        messages: Array.isArray(runtime.messages) ? [...runtime.messages] : [],
      },
      results: {},
      startedAt: Date.now(),
    };
  }

  createDefaultPipeline(customPipeline) {
    if (Array.isArray(customPipeline) && customPipeline.length) {
      return customPipeline;
    }

    return [
      { id: 'search', label: '资料检索', weight: 0.35 },
      { id: 'modeling', label: '结构化建模', weight: 0.33 },
      { id: 'report', label: '洞察报告', weight: 0.32 },
    ];
  }

  async processResearchTask(topic, baseModel, onStep, options = {}) {
    if (this.status.isProcessing) {
      throw new Error('已有研究任务正在执行');
    }

    const emit = typeof onStep === 'function' ? onStep : () => {};
    const pipeline = this.createDefaultPipeline(options.pipeline);

    const llmClient = options.llmClient || this.baseLLMClient || this.createLLMClient(options);

    const context = this.buildExecutionContext(
      topic,
      baseModel,
      {
        depth: options.depth,
        focus: options.focus,
        search: options.search,
        modeling: options.modeling,
        report: options.report,
      },
      options.deepAgent,
      {
        llmClient,
        searchClient: this.searchClient,
        messages: options.messages,
      }
    );

    context.options = { ...options };

    this.status = {
      isProcessing: true,
      currentStep: null,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      completedSteps: [],
    };
    this.abortRequested = false;

    try {
      await this.executePipeline(pipeline, context, emit);
      this.status.finishedAt = new Date().toISOString();
      return context;
    } finally {
      this.status.isProcessing = false;
      this.status.currentStep = null;
      if (!this.status.finishedAt) {
        this.status.finishedAt = new Date().toISOString();
      }
    }
  }

  async executePipeline(pipeline, context, emit) {
    if (!Array.isArray(pipeline) || pipeline.length === 0) {
      return context;
    }

    const totalWeight = pipeline.reduce((sum, step) => sum + (step.weight ?? 1), 0) || 1;
    let accumulatedWeight = 0;

    for (const step of pipeline) {
      if (this.abortRequested) {
        emit?.(step.id, 'error', accumulatedWeight / totalWeight, '任务已中断', {
          fallback: true,
          reason: 'aborted',
        });
        break;
      }

      const stepWeight = step.weight ?? 1;
      const progressBase = accumulatedWeight;
      const progressStep = stepWeight;

      this.status.currentStep = step.id;
      emit?.(step.id, 'start', accumulatedWeight / totalWeight, step.label || step.id, {
        stepType: step.stepType || step.id,
      });

      let result;
      try {
        result = await this.executeStep(step, context, (progressPayload = {}) => {
          const ratio = typeof progressPayload.ratio === 'number' ? progressPayload.ratio : 0;
          const absoluteProgress = (progressBase + ratio * progressStep) / totalWeight;
          emit?.(step.id, 'progress', absoluteProgress, progressPayload.message || '', {
            ...progressPayload,
          });
        });
      } catch (error) {
        emit?.(step.id, 'error', progressBase / totalWeight, error.message || '步骤执行失败', {
          error: {
            message: error.message,
            stack: error.stack,
          },
        });
        throw error;
      }

      context.results[step.id] = result;
      accumulatedWeight += stepWeight;

      const fallback = Boolean(result?.metadata?.isFallback);
      const completionPayload = {
        result,
        fallback,
        fallbackReason: result?.metadata?.fallbackReason || null,
      };

      emit?.(
        step.id,
        'complete',
        accumulatedWeight / totalWeight,
        result?.metadata?.fallbackMessage || step.label || step.id,
        completionPayload
      );

      this.status.completedSteps.push(step.id);
    }

    return context;
  }

  async executeStep(step, context, emitProgress) {
    if (typeof step?.handler === 'function') {
      return step.handler(context, emitProgress);
    }

    const agent = this.ensureAgent(step.id, context);
    if (!agent || typeof agent.run !== 'function') {
      return {
        output: null,
        metadata: {
          isFallback: true,
          fallbackReason: 'missing_agent',
        },
      };
    }

    const payload = this.createStepPayload(step.id, context);
    const runtime = this.createStepRuntime(step.id, context, emitProgress);

    const output = await agent.run(payload, runtime);
    return {
      output,
      metadata: output?.metadata || {},
    };
  }

  ensureAgent(stepId, context) {
    const llmClient = context.runtime?.llmClient || this.baseLLMClient;

    if (stepId === 'search') {
      if (!this.agents.searchAgent) {
        this.agents.searchAgent = new SearchAgent({
          llmClient,
          config: context.task?.search || {},
          searchClient: context.runtime?.searchClient || this.searchClient,
        });
      } else {
        if (!this.agents.searchAgent.llm && llmClient) {
          this.agents.searchAgent.llm = llmClient;
        }
        this.agents.searchAgent.searchClient = context.runtime?.searchClient || this.searchClient;
        this.agents.searchAgent.config = {
          ...this.agents.searchAgent.config,
          ...(context.task?.search || {}),
        };
      }
      return this.agents.searchAgent;
    }

    if (stepId === 'modeling') {
      if (!this.agents.modelingAgent) {
        this.agents.modelingAgent = new ModelingAgent({
          llmClient,
          config: context.task?.modeling || {},
        });
      } else if (!this.agents.modelingAgent.llm && llmClient) {
        this.agents.modelingAgent.llm = llmClient;
      }
      this.agents.modelingAgent.config = {
        ...this.agents.modelingAgent.config,
        ...(context.task?.modeling || {}),
      };
      return this.agents.modelingAgent;
    }

    if (stepId === 'report') {
      if (!this.agents.reportAgent) {
        this.agents.reportAgent = new ReportAgent({
          llmClient,
          config: context.task?.report || {},
        });
      } else if (!this.agents.reportAgent.llm && llmClient) {
        this.agents.reportAgent.llm = llmClient;
      }
      this.agents.reportAgent.config = {
        ...this.agents.reportAgent.config,
        ...(context.task?.report || {}),
      };
      return this.agents.reportAgent;
    }

    return null;
  }

  createStepPayload(stepId, context) {
    switch (stepId) {
      case 'search':
        return {
          query: context.topic,
          config: context.task?.search || {},
          previous: {
            plan: context.results.plan?.output,
            modeling: context.results.modeling?.output,
          },
        };
      case 'modeling':
        return {
          query: context.topic,
          evidence: context.results.search?.output?.notes || [],
          strategy: context.results.search?.output?.strategy || {},
          modelOverride: context.task?.modeling?.model,
          sampling: context.task?.modeling?.sampling,
        };
      case 'report':
        return {
          query: context.topic,
          model: context.results.modeling?.output || {},
          evidence: context.results.search?.output?.notes || [],
          options: context.task?.report || {},
          modelOverride: context.task?.report?.model,
        };
      default:
        return {
          query: context.topic,
          context,
        };
    }
  }

  createStepRuntime(stepId, context, emitProgress) {
    const modelKey = STEP_MODEL_KEYS[stepId] || 'report';
    const baseSampling = context.deepAgent?.sampling || DEFAULT_SAMPLING;
    const taskSampling = context.task?.[stepId]?.sampling || {};

    const runtime = {
      model: context.deepAgent?.models?.[modelKey] || context.baseModel,
      sampling: {
        ...baseSampling,
        ...taskSampling,
      },
      emitProgress,
    };

    if (stepId === 'report' && typeof context.task?.report?.onToken === 'function') {
      runtime.onToken = context.task.report.onToken;
    }

    return runtime;
  }

  createLLMClient(options = {}) {
    const provider = ensureString(options.provider, 'deepseek');
    return new HttpLLMClient(provider, httpApiClient);
  }
}

export { ResearchTaskProcessor as R };
