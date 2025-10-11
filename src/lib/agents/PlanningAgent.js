import BaseAgent from './BaseAgent.js';
import { extractJson } from './utils.js';

const ensureArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item.trim() : item)).filter(Boolean);
};

const ensureString = (value, fallback = '') => {
  return typeof value === 'string' && value.trim().length ? value.trim() : fallback;
};

const formatMilestone = (milestone, index) => {
  const title = ensureString(milestone.title, `阶段 ${index + 1}`);
  const description = ensureString(milestone.description, '概述缺失');
  const actions = ensureArray(milestone.actions).map((action) => `- ${action}`);
  const deliverables = ensureArray(milestone.deliverables);
  const deliverableLines = deliverables.length
    ? deliverables.map((item) => `  · 交付物：${item}`)
    : [];
  return [
    `${index + 1}. ${title}`,
    `   ${description}`,
    ...(actions.length ? ['   关键行动：', ...actions.map((line) => `   ${line}`)] : []),
    ...deliverableLines.map((line) => `   ${line}`)
  ].join('\n');
};

const FALLBACK_MILESTONES = [
  {
    title: '界定研究范围',
    description: '确认目标受众、时效性与评估指标，拆解主要研究问题。',
    actions: ['梳理现有已知信息与盲点', '确定必须覆盖的子问题与背景维度'],
    deliverables: ['研究问题列表', '背景假设与待验证要点']
  },
  {
    title: '外部证据检索',
    description: '结合通用搜索与垂直数据库，收集最新可信来源并记录证据信心。',
    actions: ['构造多组查询语句覆盖不同维度', '筛选 12-18 条高价值来源并摘要'],
    deliverables: ['检索策略与执行记录', '初步证据笔记']
  },
  {
    title: '结构化建模',
    description: '围绕关键驱动因素和因果链条构建分析模型，量化不确定性。',
    actions: ['归类证据并映射到驱动因素', '构建情景分析与指标估算'],
    deliverables: ['模型蓝图草稿', '风险与假设列表']
  },
  {
    title: '洞察整合与交付',
    description: '将模型与证据整合为面向决策者的洞察报告，并突出可执行建议。',
    actions: ['撰写执行摘要与关键结论', '汇总引用与附录资料'],
    deliverables: ['洞察报告草稿', '引用与附录清单']
  }
];

export default class PlanningAgent extends BaseAgent {
  constructor({ llmClient, config = {} } = {}) {
    super({ name: 'PlanningAgent', llmClient, config });
  }

  async run(payload = {}, runtime = {}) {
    const startedAt = Date.now();
    const {
      query,
      focus = [],
      depth = 'balanced',
      constraints = [],
      outcomes = [],
      prior = []
    } = payload;

    if (!query) {
      throw new Error('[PlanningAgent] 缺少 query');
    }

    const fallback = (reason, extra = {}) => {
      const plan = this.createFallbackPlan({ query, focus, depth, outcomes, constraints });
      const duration = Date.now() - startedAt;
      return {
        ...plan,
        metadata: {
          ...(plan.metadata || {}),
          ...extra,
          durationMs: duration,
          isFallback: true,
          fallbackReason: reason
        }
      };
    };

    if (!this.llm) {
      return fallback('planner_unavailable');
    }

    const model = runtime.model || this.getDefaultModel();
    const sampling = this.getSamplingOptions(runtime.sampling);

    const instruction = `你是一名战略研究规划专家，需要为以下主题制定一份结构化的研究计划：\n\n` +
      `主题：${query}\n` +
      `${focus.length ? `优先关注：${focus.join('、')}\n` : ''}` +
      `${outcomes.length ? `预期交付：${outcomes.join('、')}\n` : ''}` +
      `${constraints.length ? `约束条件：${constraints.join('、')}\n` : ''}` +
      `深度偏好：${depth}.\n` +
      `${prior.length ? '已有上下文消息已在 prior 字段提供。' : ''}` +
      `\n请输出 JSON，字段包括：\n` +
      `- objective: 总体研究目标描述\n` +
      `- focusAreas: 关注重点数组\n` +
      `- phases: 阶段数组，每个包含 title, description, actions (数组), deliverables (数组)\n` +
      `- checkpoints: 关键检查节点或决策点数组\n` +
      `- risks: 潜在风险数组\n` +
      `- notes: 其他补充说明数组\n` +
      `- metadata: { depth, confidence }\n严格返回 JSON。`;

    try {
      const planText = await this.invokeLLM({
        model,
        prompt: prior.length
          ? `${JSON.stringify(prior)}\n\n${instruction}`
          : instruction,
        options: sampling
      });
      const parsed = extractJson(planText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('未能解析规划结果');
      }
      const normalized = this.normalizePlan(parsed, {
        query,
        focus,
        depth,
        outcomes
      });
      const duration = Date.now() - startedAt;
      return {
        ...normalized,
        metadata: {
          ...(normalized.metadata || {}),
          durationMs: duration,
          isFallback: false
        }
      };
    } catch (error) {
      return fallback('planner_error', { error: error.message });
    }
  }

  normalizePlan(rawPlan, context = {}) {
    const timestamp = new Date().toISOString();
    const objective = ensureString(rawPlan.objective, `围绕“${context.query}”形成可执行洞察`);
    const focusAreas = ensureArray(rawPlan.focusAreas).length
      ? ensureArray(rawPlan.focusAreas)
      : ensureArray(context.focus);
    const phases = Array.isArray(rawPlan.phases) && rawPlan.phases.length
      ? rawPlan.phases
      : FALLBACK_MILESTONES;
    const checkpoints = ensureArray(rawPlan.checkpoints);
    const risks = ensureArray(rawPlan.risks);
    const notes = ensureArray(rawPlan.notes);

    const contentSections = phases.map((phase, index) => formatMilestone(phase, index));
    const summaryLines = [
      `研究目标：${objective}`,
      focusAreas.length ? `关注重点：${focusAreas.join('、')}` : null,
      context.outcomes?.length ? `预期交付：${context.outcomes.join('、')}` : null
    ].filter(Boolean);

    const content = [...summaryLines, '', ...contentSections].join('\n');

    return {
      objective,
      focusAreas,
      phases: phases.map((phase, index) => ({
        title: ensureString(phase.title, `阶段 ${index + 1}`),
        description: ensureString(phase.description, ''),
        actions: ensureArray(phase.actions),
        deliverables: ensureArray(phase.deliverables)
      })),
      checkpoints,
      risks,
      notes,
      content,
      metadata: {
        ...(rawPlan.metadata || {}),
        depth: rawPlan.metadata?.depth || context.depth || 'balanced',
        timestamp
      },
      timestamp
    };
  }

  createFallbackPlan({ query, focus, depth, outcomes, constraints }) {
    const timestamp = new Date().toISOString();
    const phases = FALLBACK_MILESTONES;
    const contentSections = phases.map((phase, index) => formatMilestone(phase, index));
    const summaryLines = [
      `研究目标：围绕“${query}”形成可靠洞察`,
      focus.length ? `关注重点：${focus.join('、')}` : null,
      outcomes.length ? `预期交付：${outcomes.join('、')}` : null,
      constraints.length ? `约束：${constraints.join('、')}` : null
    ].filter(Boolean);

    return {
      objective: `围绕“${query}”形成可执行研究洞察`,
      focusAreas: focus,
      phases,
      checkpoints: ['确认研究目标', '完成证据收集', '完成模型构建', '交付洞察报告'],
      risks: ['外部数据稀缺', '时间受限'],
      notes: ['此规划由系统回退策略生成，可在执行中持续补充细节。'],
      content: [...summaryLines, '', ...contentSections].join('\n'),
      metadata: {
        depth,
        timestamp,
        isFallback: true
      },
      timestamp
    };
  }
}
