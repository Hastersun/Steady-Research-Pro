import HttpLLMClient from './llm-router.js';
import httpApiClient from './http-api.js';
import searchApiClient from './search-api-client.js';
import PlanningAgent from './agents/PlanningAgent.js';
import SearchAgent from './agents/SearchAgent.js';
import ModelingAgent from './agents/ModelingAgent.js';
import ReportAgent from './agents/ReportAgent.js';

const DEFAULT_SAMPLING = {
  temperature: 0.3,
  topP: 0.85
};

const STEP_MODEL_KEYS = {
  plan: 'search',
  search: 'search',
  deep_search: 'search',
  modeling: 'modeling',
  report: 'report',
  reporting: 'report',
  synthesis: 'report'
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

export default class ResearchTaskProcessor {
  constructor({ llmClient = null, searchClient = null, agents = {} } = {}) {
    this.baseLLMClient = llmClient;
    this.searchClient = searchClient || searchApiClient;
    this.agents = {
      planningAgent: agents.planningAgent || null,
      searchAgent: agents.searchAgent || null,
      modelingAgent: agents.modelingAgent || null,
      reportAgent: agents.reportAgent || null
    };

    this.status = {
      isProcessing: false,
      currentStep: null,
      startedAt: null,
      finishedAt: null,
      completedSteps: []
    };

    this.abortRequested = false;
  }

  getProcessingStatus() {
    return {
      isProcessing: this.status.isProcessing,
      currentStep: this.status.currentStep,
      startedAt: this.status.startedAt,
      finishedAt: this.status.finishedAt,
      completedSteps: [...this.status.completedSteps]
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
        report: baseModel
      },
      sampling: { ...DEFAULT_SAMPLING },
      providerMapping: { enabled: false }
    };

    if (!overrides || typeof overrides !== 'object') {
      return baseConfig;
    }

    const explicitModels = typeof overrides.models === 'object' && overrides.models
      ? overrides.models
      : {};

    const mapping = typeof overrides.providerMapping === 'object' && overrides.providerMapping
      ? overrides.providerMapping
      : {};

    const mappingEnabled = Boolean(mapping.enabled);

    const resolvedModels = {
      search: ensureString(explicitModels.search, mappingEnabled ? mapping.search : baseModel) || baseModel,
      modeling: ensureString(explicitModels.modeling, mappingEnabled ? mapping.modeling : baseModel) || baseModel,
      report: ensureString(explicitModels.report, mappingEnabled ? mapping.report : baseModel) || baseModel
    };

    const rawSampling = typeof overrides.sampling === 'object' && overrides.sampling
      ? overrides.sampling
      : {};

    const resolvedSampling = {
      temperature: clampNumber(rawSampling.temperature, 0, 2, DEFAULT_SAMPLING.temperature),
      topP: clampNumber(rawSampling.topP ?? rawSampling.top_p, 0, 1, DEFAULT_SAMPLING.topP)
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
        enabled: Boolean(mappingEnabled)
      }
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
        messages: Array.isArray(runtime.messages) ? [...runtime.messages] : []
      },
      results: {},
      startedAt: Date.now()
    };
  }

  createDefaultPipeline(customPipeline) {
    if (Array.isArray(customPipeline) && customPipeline.length) {
      return customPipeline;
    }

    return [
      { id: 'plan', stepType: 'plan', label: '研究计划', weight: 0.14 },
      { id: 'search', stepType: 'deep_search', label: '资料检索', weight: 0.33 },
      { id: 'modeling', stepType: 'modeling', label: '结构化建模', weight: 0.26 },
      {
        id: 'synthesis',
        stepType: 'reporting',
        label: '洞察报告',
        weight: 0.27,
        resultKey: 'reporting'
      }
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
        constraints: options.constraints,
        outcomes: options.outcomes,
        plan: options.plan,
        search: options.search,
        modeling: options.modeling,
        report: options.report
      },
      options.deepAgent,
      {
        llmClient,
        searchClient: this.searchClient,
        messages: options.messages
      }
    );

    context.options = { ...options };

    this.status = {
      isProcessing: true,
      currentStep: null,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      completedSteps: []
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
          reason: 'aborted'
        });
        break;
      }

      const stepWeight = step.weight ?? 1;
      const progressBase = accumulatedWeight;
      const progressStep = stepWeight;

      this.status.currentStep = step.id;
      emit?.(step.id, 'start', accumulatedWeight / totalWeight, step.label || step.id, {
        stepType: step.stepType || step.id
      });

      let result;
      try {
        result = await this.executeStep(step, context, (progressPayload = {}) => {
          const ratio = typeof progressPayload.ratio === 'number' ? progressPayload.ratio : 0;
          const absoluteProgress = (progressBase + ratio * progressStep) / totalWeight;
          emit?.(step.id, 'progress', absoluteProgress, progressPayload.message || '', {
            ...progressPayload
          });
        });
      } catch (error) {
        emit?.(step.id, 'error', progressBase / totalWeight, error.message || '步骤执行失败', {
          error: {
            message: error.message,
            stack: error.stack
          }
        });
        throw error;
      }

      const resultKey = step.resultKey || step.stepType || step.id;
      const outputPayload = result?.output ?? null;
      const mergedMetadata = {
        ...(outputPayload && typeof outputPayload === 'object' ? outputPayload.metadata || {} : {}),
        ...(result?.metadata || {})
      };

      if (outputPayload && typeof outputPayload === 'object' && Object.keys(mergedMetadata).length) {
        outputPayload.metadata = mergedMetadata;
      } else if (
        outputPayload &&
        typeof outputPayload === 'object' &&
        !outputPayload.metadata &&
        result?.metadata
      ) {
        outputPayload.metadata = result.metadata;
      }

      if (outputPayload && typeof outputPayload === 'object') {
        context.results[resultKey] = outputPayload;
        if (resultKey !== step.id) {
          context.results[step.id] = outputPayload;
        }
      } else if (outputPayload !== null && outputPayload !== undefined) {
        context.results[resultKey] = outputPayload;
        if (resultKey !== step.id) {
          context.results[step.id] = outputPayload;
        }
      } else {
        context.results[resultKey] = result;
        if (resultKey !== step.id) {
          context.results[step.id] = result;
        }
      }
      accumulatedWeight += stepWeight;

      const fallback = Boolean(
        mergedMetadata?.isFallback ??
        result?.metadata?.isFallback ??
        (outputPayload && typeof outputPayload === 'object' && outputPayload.metadata?.isFallback)
      );
      const completionPayload = {
        result: outputPayload || result,
        metadata: mergedMetadata,
        fallback,
        fallbackReason:
          mergedMetadata?.fallbackReason ||
          result?.metadata?.fallbackReason ||
          (outputPayload && typeof outputPayload === 'object'
            ? outputPayload.metadata?.fallbackReason
            : null) ||
          null,
        stepType: step.stepType || step.id
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

    const agent = this.ensureAgent(step, context);
    if (!agent || typeof agent.run !== 'function') {
      return {
        output: null,
        metadata: {
          isFallback: true,
          fallbackReason: 'missing_agent'
        }
      };
    }

    const payload = this.createStepPayload(step, context);
    const runtime = this.createStepRuntime(step, context, emitProgress);

    const output = await agent.run(payload, runtime);
    return {
      output,
      metadata: output?.metadata || {}
    };
  }

  ensureAgent(step, context) {
    const stepId = typeof step === 'string' ? step : step.id;
    const stepType = typeof step === 'object' ? step.stepType : null;
    const llmClient = context.runtime?.llmClient || this.baseLLMClient;

    if (stepId === 'plan' || stepType === 'plan') {
      if (!this.agents.planningAgent) {
        this.agents.planningAgent = new PlanningAgent({
          llmClient,
          config: context.task?.plan || {}
        });
      } else if (!this.agents.planningAgent.llm && llmClient) {
        this.agents.planningAgent.llm = llmClient;
      }
      this.agents.planningAgent.config = {
        ...this.agents.planningAgent.config,
        ...(context.task?.plan || {})
      };
      return this.agents.planningAgent;
    }

    if (stepId === 'search' || stepType === 'deep_search') {
      if (!this.agents.searchAgent) {
        this.agents.searchAgent = new SearchAgent({
          llmClient,
          config: context.task?.search || {},
          searchClient: context.runtime?.searchClient || this.searchClient
        });
      } else {
        if (!this.agents.searchAgent.llm && llmClient) {
          this.agents.searchAgent.llm = llmClient;
        }
        this.agents.searchAgent.searchClient = context.runtime?.searchClient || this.searchClient;
        this.agents.searchAgent.config = {
          ...this.agents.searchAgent.config,
          ...(context.task?.search || {})
        };
      }
      return this.agents.searchAgent;
    }

    if (stepId === 'modeling' || stepType === 'modeling') {
      if (!this.agents.modelingAgent) {
        this.agents.modelingAgent = new ModelingAgent({
          llmClient,
          config: context.task?.modeling || {}
        });
      } else if (!this.agents.modelingAgent.llm && llmClient) {
        this.agents.modelingAgent.llm = llmClient;
      }
      this.agents.modelingAgent.config = {
        ...this.agents.modelingAgent.config,
        ...(context.task?.modeling || {})
      };
      return this.agents.modelingAgent;
    }

    if (stepId === 'report' || stepId === 'synthesis' || stepType === 'reporting') {
      if (!this.agents.reportAgent) {
        this.agents.reportAgent = new ReportAgent({
          llmClient,
          config: context.task?.report || {}
        });
      } else if (!this.agents.reportAgent.llm && llmClient) {
        this.agents.reportAgent.llm = llmClient;
      }
      this.agents.reportAgent.config = {
        ...this.agents.reportAgent.config,
        ...(context.task?.report || {})
      };
      return this.agents.reportAgent;
    }

    return null;
  }

  createStepPayload(step, context) {
    const stepId = typeof step === 'string' ? step : step.id;
    const stepType = typeof step === 'object' ? step.stepType : null;
    switch (stepId) {
      case 'plan':
        return {
          query: context.topic,
          focus: context.task?.focus || [],
          depth: context.task?.depth || 'balanced',
          constraints: context.task?.constraints || [],
          outcomes: context.task?.outcomes || [],
          prior: Array.isArray(context.runtime?.messages) ? context.runtime.messages : []
        };
      case 'search':
      case 'deep_search':
        return {
          query: context.topic,
          config: context.task?.search || {},
          previous: {
            plan: context.results.plan || context.results.plan?.output,
            modeling: context.results.modeling?.output
          }
        };
      case 'modeling':
        return {
          query: context.topic,
          evidence:
            context.results.search?.output?.notes ||
            context.results.search?.notes ||
            context.results.deep_search?.notes ||
            [],
          strategy:
            context.results.search?.output?.strategy ||
            context.results.search?.strategy ||
            context.results.deep_search?.strategy ||
            {},
          modelOverride: context.task?.modeling?.model,
          sampling: context.task?.modeling?.sampling
        };
      case 'report':
      case 'synthesis':
      case 'reporting':
        return {
          query: context.topic,
          model: context.results.modeling?.output || context.results.modeling || {},
          evidence:
            context.results.search?.output?.notes ||
            context.results.search?.notes ||
            context.results.deep_search?.notes ||
            [],
          options: context.task?.report || {},
          modelOverride: context.task?.report?.model
        };
      default:
        return {
          query: context.topic,
          context,
          stepType: stepType || stepId
        };
    }
  }

  createStepRuntime(step, context, emitProgress) {
    const stepId = typeof step === 'string' ? step : step.id;
    const stepType = typeof step === 'object' ? step.stepType : null;
    const modelKey = STEP_MODEL_KEYS[stepType || stepId] || 'report';
    const taskKey = stepId === 'synthesis' ? 'report' : stepId;
    const baseSampling = context.deepAgent?.sampling || DEFAULT_SAMPLING;
    const taskSampling = context.task?.[taskKey]?.sampling || {};

    const runtime = {
      model: context.deepAgent?.models?.[modelKey] || context.baseModel,
      sampling: {
        ...baseSampling,
        ...taskSampling
      },
      emitProgress
    };

    if (
      (stepId === 'report' || stepId === 'synthesis' || stepType === 'reporting') &&
      typeof context.task?.report?.onToken === 'function'
    ) {
      runtime.onToken = context.task.report.onToken;
    }

    return runtime;
  }

  createLLMClient(options = {}) {
    const provider = ensureString(options.provider, 'deepseek');
    return new HttpLLMClient(provider, httpApiClient);
  }
}
