import BaseAgent from './BaseAgent.js';
import searchApiClient from '../search-api-client.js';
import { extractJson, truncate } from './utils.js';

const DEFAULT_ENGINES = ['bing', 'google'];
const DEFAULT_ENGINE_OPTIONS = {
  bing: { count: 5, market: 'zh-CN' },
  google: { num: 5, lr: 'lang_zh-CN' },
};

const stripBullet = line => line.replace(/^[-*•\d.)\s]+/, '').trim();

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

export default class SearchAgent extends BaseAgent {
  constructor({ llmClient, config = {}, searchClient = searchApiClient } = {}) {
    super({ name: 'SearchAgent', llmClient, config });
    this.searchClient = searchClient;
  }

  // 兼容测试与外部调用：execute 别名 run
  async execute(payload = {}, runtime = {}) {
    return await this.run(payload, runtime);
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
    } catch {
      // 忽略规划失败，后续使用回退策略
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
      } catch {
        // 摘要生成失败，使用回退
      }
    }

    const finishedAt = Date.now();
    const summarizationFallback = !summaryJson;
    const noResultsReturned = uniqueResults.length === 0;
    const allQueriesFailed = searchErrors.length && searchResults.length === 0;
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
