import BaseAgent from './BaseAgent.js';
import { buildOutline, truncate } from './utils.js';

const buildSourceList = (evidence = []) => {
  return evidence
    .map((item, index) => ({
      title: item.topic || item.summary?.slice(0, 60) || `来源 ${index + 1}`,
      url: item.sourceUrl || item.url || '',
      noteIndex: index,
    }))
    .filter(source => !!source.url);
};

export default class ReportAgent extends BaseAgent {
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
