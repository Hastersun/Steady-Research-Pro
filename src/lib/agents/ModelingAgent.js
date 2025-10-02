import BaseAgent from './BaseAgent.js';
import { extractJson, truncate } from './utils.js';

export default class ModelingAgent extends BaseAgent {
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
    const {
      query,
      evidence = [],
      strategy = {},
      modelOverride
    } = payload;

    if (!query) {
      throw new Error('[ModelingAgent] 缺少 query');
    }

    const resolvedModel = modelOverride || runtime.model || this.getDefaultModel();
    const sampling = this.getSamplingOptions({ ...runtime.sampling, ...payload.sampling });

    const evidenceSnapshot = evidence.slice(0, 12).map((item, index) => (
      `${index + 1}. 摘要: ${truncate(item.summary, 280)}\n   来源: ${item.sourceUrl || 'N/A'}\n   主题: ${item.topic || '未指定'}\n`
    )).join('\n');

    const strategyFocus = Array.isArray(strategy?.focusAreas)
      ? strategy.focusAreas.join(', ')
      : (strategy?.notes || '');

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
        options: sampling
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
          weight: 0.5
        })),
        relationships: [],
        scenarios: [],
        metrics: [],
        risks: [],
        opportunities: [],
        metadata: {
          durationMs: finishedAt - startedAt,
          warnings: ['LLM 输出解析失败，已回退至基于证据的简单模型'],
          rawText
        }
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
        rawText
      }
    };
  }
}
