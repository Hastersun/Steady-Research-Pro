// 多提供商研究主流程
// @ts-nocheck

const { getOllamaClient } = require('./ollama-client');
const { getLLMClient } = require('./llm-router');
const { SearchAgent } = require('./agents/SearchAgent');
const { ReportAgent } = require('./agents/ReportAgent');
const { ModelingAgent } = require('./agents/ModelingAgent');

/**
 * 研究任务主入口
 * @param {Object} options - 任务参数
 * @param {string} options.provider - LLM供应商（如 'ollama', 'openai', 'deepseek', 'claude', 'gemini'）
 * @param {string} options.model - 模型名称
 * @param {number} options.temperature - 采样温度
 * @param {Array} options.messages - 额外上下文消息
 * @param {Object} options.task - 研究主题与配置
 * @param {Function} options.onStep - 步骤回调 (stepId, status, progress, message, data)
 */
async function processResearchTask({ provider, model, temperature, messages = [], task, onStep }) {
  // 1. 获取推理客户端
  const llmClient = getLLMClient({ provider, model, temperature });

  // 2. 规划步骤
  onStep('plan', 'running', 0.05, '正在生成研究计划...');
  let plan;
  try {
    plan = await ModelingAgent.plan({ llmClient, task, messages });
    onStep('plan', 'done', 0.15, '研究计划生成完成', plan);
  } catch (err) {
    onStep('plan', 'error', 0.15, '研究计划生成失败', { error: err });
    throw err;
  }

  // 3. 搜索
  onStep('search', 'running', 0.18, '正在检索相关资料...');
  let searchResults;
  try {
    searchResults = await SearchAgent.search({ plan, llmClient, task });
    onStep('search', 'done', 0.35, '检索完成', searchResults);
  } catch (err) {
    onStep('search', 'error', 0.35, '检索失败', { error: err });
    throw err;
  }

  // 4. 信息抽取
  onStep('extract', 'running', 0.38, '正在抽取关键信息...');
  let extracted;
  try {
    extracted = await SearchAgent.extract({ searchResults, llmClient, task });
    onStep('extract', 'done', 0.55, '信息抽取完成', extracted);
  } catch (err) {
    onStep('extract', 'error', 0.55, '信息抽取失败', { error: err });
    throw err;
  }

  // 5. 聚类归纳
  onStep('cluster', 'running', 0.58, '正在聚类归纳...');
  let clustered;
  try {
    clustered = await ModelingAgent.cluster({ extracted, llmClient, task });
    onStep('cluster', 'done', 0.75, '聚类完成', clustered);
  } catch (err) {
    onStep('cluster', 'error', 0.75, '聚类失败', { error: err });
    throw err;
  }

  // 6. 结论报告
  onStep('synthesis', 'running', 0.78, '正在生成结论报告...');
  let report;
  try {
    report = await ReportAgent.synthesis({ clustered, llmClient, task });
    onStep('synthesis', 'done', 1.0, '报告生成完成', report);
  } catch (err) {
    onStep('synthesis', 'error', 1.0, '报告生成失败', { error: err });
    throw err;
  }

  return { plan, searchResults, extracted, clustered, report };
}

module.exports = { processResearchTask };