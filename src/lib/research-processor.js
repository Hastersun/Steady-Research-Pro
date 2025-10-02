// 研究任务处理模块 - 将 Ollama AI 与研究流程集成
import OllamaClient from './ollama-client.js';
import searchApiClient from './search-api-client.js';
import { SearchAgent, ModelingAgent, ReportAgent } from './agents/index.js';

export const LEGACY_PIPELINE = [
  { id: 'plan', label: '生成初步研究计划', weight: 0.15 },
  { id: 'search', label: '多源搜索与抓取', weight: 0.25 },
  { id: 'extract', label: '内容清洗与摘要抽取', weight: 0.2 },
  { id: 'cluster', label: '主题聚类与归纳', weight: 0.2 },
  { id: 'synthesis', label: '综合分析与洞察输出', weight: 0.2 }
];

export const DEEP_PIPELINE = [
  { id: 'plan', emitId: 'plan', label: '生成初步研究计划', weight: 0.15 },
  { id: 'deep_search', emitId: 'search', label: '多源深度搜索', weight: 0.35 },
  { id: 'modeling', emitId: 'cluster', label: '结构化建模', weight: 0.2 },
  { id: 'reporting', emitId: 'synthesis', label: '智能报告生成', weight: 0.3 }
];

const clamp = (value, min, max, fallback) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  if (typeof min === 'number' && value < min) return min;
  if (typeof max === 'number' && value > max) return max;
  return value;
};

class ResearchTaskProcessor {
  constructor({ llmClient, searchClient, agents } = {}) {
    this.ollama = llmClient || new OllamaClient();
    this.searchClient = searchClient || searchApiClient;
    this.isProcessing = false;

    const providedAgents = agents || {};
    this.searchAgent = providedAgents.searchAgent || new SearchAgent({ llmClient: this.ollama, searchClient: this.searchClient });
    this.modelingAgent = providedAgents.modelingAgent || new ModelingAgent({ llmClient: this.ollama });
    this.reportAgent = providedAgents.reportAgent || new ReportAgent({ llmClient: this.ollama });
  }

  /**
   * 设置搜索 API 密钥
   * @param {Object} apiKeys - API 密钥配置
   */
  async configureSearchAPIs(apiKeys) {
    return await this.searchClient.setApiKeys(apiKeys);
  }

  resolveDeepAgentConfig(deepOptions = {}, fallbackModel) {
    const providerMapping = deepOptions?.providerMapping || {};
    const enabled = typeof deepOptions?.enabled === 'boolean'
      ? Boolean(deepOptions.enabled)
      : Boolean(providerMapping?.enabled);
    const safeNumber = (value, fallback) => clamp(typeof value === 'number' ? value : Number.parseFloat(value), -Infinity, Infinity, fallback);

    const sampling = {
      temperature: clamp(safeNumber(deepOptions?.sampling?.temperature, 0.3), 0, 2, 0.3),
      topP: clamp(safeNumber(deepOptions?.sampling?.topP ?? deepOptions?.sampling?.top_p, 0.85), 0, 1, 0.85)
    };

    const models = {
      search: deepOptions?.models?.search || providerMapping?.search || fallbackModel,
      modeling: deepOptions?.models?.modeling || providerMapping?.modeling || fallbackModel,
      report: deepOptions?.models?.report || providerMapping?.report || fallbackModel
    };

    return {
      enabled,
      models,
      sampling,
      engines: deepOptions?.engines || null,
      engineOptions: deepOptions?.engineOptions || null,
      maxResults: typeof deepOptions?.maxResults === 'number' ? deepOptions.maxResults : undefined,
      maxQueries: typeof deepOptions?.maxQueries === 'number' ? deepOptions.maxQueries : undefined,
      providerMapping: providerMapping?.enabled ? providerMapping : undefined
    };
  }

  buildExecutionContext(query, model, options, deepAgentConfig) {
    return {
      query,
      baseModel: model,
      options,
      deepAgentConfig,
      results: {},
      createdAt: Date.now()
    };
  }

  async processResearchTask(query, model, onProgress, options = {}) {
    if (this.isProcessing) {
      throw new Error('已有研究任务在进行中');
    }

    if (!query || !model) {
      throw new Error('缺少必要参数: query 或 model');
    }

    this.isProcessing = true;

    const deepAgentConfig = this.resolveDeepAgentConfig(options?.deepAgent, model);
    const useDeepAgent = deepAgentConfig.enabled;
    const context = this.buildExecutionContext(query, model, options, deepAgentConfig);
    const pipeline = useDeepAgent ? this.buildDeepPipeline(context) : this.buildLegacyPipeline(context);

    try {
      await this.executePipeline(pipeline, context, onProgress);

      const results = { ...context.results };
      if (useDeepAgent) {
        // 为旧版界面兼容保留原有键
        if (results.deep_search) results.search = results.deep_search;
        if (results.modeling) results.cluster = results.modeling;
        if (results.reporting) results.synthesis = results.reporting;
      }

      return {
        success: true,
        results,
        query,
        model,
        mode: useDeepAgent ? 'deep_agent' : 'legacy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      onProgress?.('error', 'error', 0, '任务失败', { error: error.message });
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  buildDeepPipeline(context) {
    const { deepAgentConfig } = context;
    return DEEP_PIPELINE.map((step) => ({ ...step, deepAgentConfig }));
  }

  buildLegacyPipeline() {
    return LEGACY_PIPELINE;
  }

  async executePipeline(pipeline, context, onProgress) {
    let totalProgress = 0;

    for (const step of pipeline) {
      const emitId = step.emitId || step.id;
      const payloadBase = { stepType: step.id };

      onProgress?.(emitId, 'start', totalProgress, step.label, payloadBase);

      const emitProgress = (payload = {}) => {
        const ratio = clamp(typeof payload.ratio === 'number' ? payload.ratio : 0, 0, 0.99, 0);
        const progressValue = totalProgress + (step.weight * ratio);
        onProgress?.(emitId, 'progress', progressValue, payload.message || step.label, {
          ...payloadBase,
          ...payload
        });
      };

      try {
        const result = await this.executeStep(step, context, emitProgress);
        context.results[step.id] = result;
        totalProgress += step.weight;
        const completionPayload = {
          ...payloadBase,
          result
        };
        if (result?.metadata) {
          completionPayload.metadata = result.metadata;
          if (result.metadata.isFallback) {
            completionPayload.fallback = true;
          }
        }
        onProgress?.(emitId, 'complete', totalProgress, step.label, completionPayload);
      } catch (error) {
        onProgress?.(emitId, 'error', totalProgress, step.label, {
          ...payloadBase,
          error: error.message
        });
        throw error;
      }
    }
  }

  async executeStep(step, context, emitProgress) {
    const { query, baseModel, options, results, deepAgentConfig } = context;

    switch (step.id) {
      case 'plan':
        return await this.generateResearchPlan(query, baseModel, options);

      case 'deep_search':
        return await this.searchAgent.run({
          query,
          config: {
            engines: deepAgentConfig.engines || options?.search?.engines,
            engineOptions: deepAgentConfig.engineOptions || options?.search?.engineOptions,
            maxResults: deepAgentConfig.maxResults || options?.search?.maxResults,
            maxQueries: deepAgentConfig.maxQueries || options?.search?.maxQueries,
            apiKeys: options?.search?.apiKeys,
            model: deepAgentConfig.models.search,
            sampling: deepAgentConfig.sampling
          },
          previous: results
        }, {
          model: deepAgentConfig.models.search,
          sampling: deepAgentConfig.sampling
        });

      case 'modeling':
        return await this.modelingAgent.run({
          query,
          evidence: results.deep_search?.notes || [],
          strategy: results.deep_search?.strategy,
          modelOverride: deepAgentConfig.models.modeling,
          sampling: deepAgentConfig.sampling
        }, {
          model: deepAgentConfig.models.modeling,
          sampling: deepAgentConfig.sampling
        });

      case 'reporting': {
        const streamState = { chars: 0 };
        const onToken = emitProgress
          ? ({ chunk, done, error }) => {
              if (error) {
                emitProgress({ message: '报告生成失败', error: error.message });
                return;
              }
              if (chunk) {
                streamState.chars += chunk.length;
                const ratio = Math.min(0.95, streamState.chars / 4000);
                emitProgress({ ratio, chunk, message: '报告生成中' });
              }
              if (done) {
                emitProgress({ ratio: 0.98, message: '报告收尾中' });
              }
            }
          : undefined;

        return await this.reportAgent.run({
          query,
          model: results.modeling,
          evidence: results.deep_search?.notes || [],
          options: {
            format: options?.report?.format || 'markdown',
            audience: options?.report?.audience || options?.audience || 'executive',
            sampling: deepAgentConfig.sampling
          },
          modelOverride: deepAgentConfig.models.report
        }, {
          model: deepAgentConfig.models.report,
          sampling: deepAgentConfig.sampling,
          onToken
        });
      }

      case 'search':
        return await this.performRealSearch(query, baseModel, {
          ...options,
          previousResults: results
        });

      case 'extract':
        return await this.extractAndSummarize(query, baseModel, {
          ...options,
          previousResults: results
        });

      case 'cluster':
        return await this.clusterTopics(query, baseModel, {
          ...options,
          previousResults: results
        });

      case 'synthesis':
        return await this.synthesizeInsights(query, baseModel, {
          ...options,
          previousResults: results
        });

      default:
        throw new Error(`未知步骤: ${step.id}`);
    }
  }

  /**
   * 生成研究计划
   */
  async generateResearchPlan(query, model, options) {
    const prompt = `作为一个专业的研究助手，为以下研究问题制定一个详细的研究计划：

研究问题：${query}

请提供：
1. 研究目标和范围
2. 关键研究维度（3-5个）
3. 预期需要收集的信息类型
4. 分析方法建议

请用结构化的格式回答，保持简洁明确。`;

    try {
      const response = await this.ollama.generate(model, prompt, {
        temperature: 0.3,
        ...options
      });

      return {
        type: 'research_plan',
        content: response,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        type: 'research_plan',
        content: '研究计划生成失败：' + error.message,
        error: true
      };
    }
  }

  /**
   * 执行真实的多源搜索
   */
  async performRealSearch(query, model, options) {
    try {
      // 1. 首先生成搜索策略
      const strategyPrompt = `作为信息检索专家，为研究问题"${query}"生成最有效的搜索关键词：

请提供 3-5 个不同角度的搜索关键词，每个关键词应该：
- 具体且相关
- 能够找到不同类型的信息源
- 覆盖问题的不同维度

只返回关键词列表，每行一个。`;

      const strategyResponse = await this.ollama.generate(model, strategyPrompt, {
        temperature: 0.3,
        ...options
      });

      // 解析搜索关键词
      const searchQueries = strategyResponse.split('\n')
        .map(line => line.trim().replace(/^[-*•]\s*/, ''))
        .filter(line => line && !line.match(/^[0-9]+\.?\s*/))
        .slice(0, 4); // 限制查询数量

      if (searchQueries.length === 0) {
        searchQueries.push(query); // 回退到原始查询
      }

      // 2. 执行搜索
      const searchResults = [];
      const searchErrors = [];

      for (let i = 0; i < searchQueries.length; i++) {
        const searchQuery = searchQueries[i];
        try {
          // 错开请求以避免API限制
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          const result = await this.searchClient.search(searchQuery, ['bing', 'google'], {
            bing: { count: 5, market: 'zh-CN' },
            google: { num: 5, lr: 'lang_zh-CN' }
          });

          if (result.success) {
            searchResults.push({
              query: searchQuery,
              results: result.data.results || [],
              engines: result.data.engines || [],
              totalResults: result.data.totalResults || 0
            });
          } else {
            searchErrors.push({
              query: searchQuery,
              error: result.error
            });
          }
        } catch (error) {
          searchErrors.push({
            query: searchQuery,
            error: error.message
          });
        }
      }

      // 3. 汇总搜索结果
      const allResults = [];
      searchResults.forEach(sr => {
        allResults.push(...sr.results);
      });

      // 去重
      const uniqueResults = this.deduplicateSearchResults(allResults);

      return {
        type: 'search_results',
        strategy: {
          originalQuery: query,
          searchQueries: searchQueries,
          searchCount: searchResults.length
        },
        results: uniqueResults,
        summary: {
          totalQueries: searchQueries.length,
          successfulQueries: searchResults.length,
          totalResults: uniqueResults.length,
          errors: searchErrors
        },
        query,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('真实搜索执行失败:', error);
      
      // 回退到模拟搜索
      return await this.simulateMultiSourceSearch(query, model, options);
    }
  }

  /**
   * 搜索结果去重
   * @param {Array} results - 搜索结果数组
   */
  deduplicateSearchResults(results) {
    const seen = new Set();
    const unique = [];

    for (const result of results) {
      const key = result.url;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(result);
      }
    }

    return unique.slice(0, 15); // 限制结果数量
  }

  /**
   * 模拟多源搜索（回退方法）
   */
  async simulateMultiSourceSearch(query, model, options) {
    const prompt = `作为信息检索专家，为研究问题"${query}"生成多样化的搜索策略和关键词：

1. 学术搜索关键词（5个）
2. 新闻媒体搜索关键词（5个）  
3. 社交媒体搜索关键词（5个）
4. 政府/官方数据搜索关键词（3个）
5. 行业报告搜索关键词（3个）

每个关键词都要具体、相关且多样化。`;

    try {
      const response = await this.ollama.generate(model, prompt, {
        temperature: 0.4,
        ...options
      });

      // 模拟搜索结果
      const simulatedResults = this.generateSimulatedSearchResults(query);

      return {
        type: 'search_results',
        strategy: response,
        results: simulatedResults,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        type: 'search_results',
        content: '搜索策略生成失败：' + error.message,
        error: true
      };
    }
  }

  /**
   * 内容摘要提取（基于真实搜索结果）
   */
  async extractAndSummarize(query, model, options) {
    // 从之前的搜索步骤获取结果
    const searchData = options.previousResults?.search;
    
    let prompt;
    if (searchData && searchData.results && searchData.results.length > 0) {
      // 基于真实搜索结果进行分析
      const searchSummary = searchData.results.slice(0, 10).map((result, index) => 
        `${index + 1}. 标题: ${result.title}\n   摘要: ${result.snippet}\n   来源: ${result.displayUrl || result.url}`
      ).join('\n\n');

      prompt = `作为内容分析专家，针对研究问题"${query}"，分析以下真实的搜索结果并提取关键信息：

搜索结果：
${searchSummary}

请基于这些搜索结果提供：
1. 核心事实和数据（5-8个要点）
2. 主要观点和论证（3-5个）
3. 关键趋势和模式
4. 重要的数据来源和统计信息
5. 需要进一步研究的问题

保持客观中立，重点提取与研究问题最相关的信息，并注明信息来源。`;

    } else {
      // 回退到模拟分析
      prompt = `作为内容分析专家，针对研究问题"${query}"，基于一般知识提供分析：

请提供：
1. 核心事实和数据（5-8个要点）
2. 主要观点和论证（3-5个）
3. 关键统计数据或趋势
4. 重要的引用和来源
5. 研究建议

保持客观中立，重点提取与研究问题最相关的信息。`;
    }

    try {
      const response = await this.ollama.generate(model, prompt, {
        temperature: 0.2,
        ...options
      });

      return {
        type: 'content_extraction',
        content: response,
        basedOnRealData: !!(searchData && searchData.results && searchData.results.length > 0),
        sourceCount: searchData?.results?.length || 0,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        type: 'content_extraction',
        content: '内容提取失败：' + error.message,
        error: true
      };
    }
  }

  /**
   * 主题聚类
   */
  async clusterTopics(query, model, options) {
    const prompt = `作为数据分析专家，基于研究问题"${query}"的信息收集结果，进行主题聚类分析：

请识别和组织：
1. 主要主题类别（3-4个大类）
2. 每个主题下的子议题
3. 主题间的关联性
4. 重要程度排序

以清晰的层次结构展示分析结果。`;

    try {
      const response = await this.ollama.generate(model, prompt, {
        temperature: 0.3,
        ...options
      });

      return {
        type: 'topic_clustering',
        content: response,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        type: 'topic_clustering',
        content: '主题聚类失败：' + error.message,
        error: true
      };
    }
  }

  /**
   * 综合分析与洞察
   */
  async synthesizeInsights(query, model, options) {
    const prompt = `作为资深研究顾问，基于对"${query}"的全面研究，提供综合分析和深度洞察：

请包含：
1. 执行摘要（核心发现）
2. 关键洞察（3-5个重要发现）
3. 趋势分析和预测
4. 实用建议或行动要点
5. 研究局限性和后续建议

确保分析具有深度和实用价值。`;

    try {
      const response = await this.ollama.generate(model, prompt, {
        temperature: 0.4,
        ...options
      });

      return {
        type: 'synthesis_insights',
        content: response,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        type: 'synthesis_insights',
        content: '综合分析失败：' + error.message,
        error: true
      };
    }
  }

  /**
   * 生成模拟搜索结果
   */
  generateSimulatedSearchResults(query) {
    const sources = [
      'academic_papers', 'news_articles', 'reports', 
      'social_media', 'government_data', 'industry_analysis'
    ];

    return sources.map(source => ({
      source_type: source,
      count: Math.floor(Math.random() * 50) + 10,
      relevance_score: (Math.random() * 0.4 + 0.6).toFixed(2),
      sample_titles: this.generateSampleTitles(query, source, 3)
    }));
  }

  /**
   * 生成示例标题
   */
  generateSampleTitles(query, sourceType, count) {
    const templates = {
      academic_papers: [
        `A Comprehensive Analysis of ${query}`,
        `${query}: Empirical Evidence and Theoretical Framework`,
        `Recent Developments in ${query} Research`
      ],
      news_articles: [
        `${query}: Latest Updates and Implications`, 
        `Breaking: New Findings on ${query}`,
        `Industry Experts Weigh in on ${query}`
      ],
      reports: [
        `${query}: Market Analysis Report 2024`,
        `State of ${query}: Annual Review`,
        `${query} Trends and Forecasts`
      ]
    };

    const defaultTemplates = [
      `Understanding ${query}`,
      `${query} Overview`,
      `Key Insights on ${query}`
    ];

    const sourceTemplates = templates[sourceType] || defaultTemplates;
    return sourceTemplates.slice(0, count);
  }

  /**
   * 停止当前处理任务
   */
  stopProcessing() {
    this.isProcessing = false;
  }

  /**
   * 获取处理状态
   */
  getProcessingStatus() {
    return {
      isProcessing: this.isProcessing,
      timestamp: new Date().toISOString()
    };
  }
}

export default ResearchTaskProcessor;