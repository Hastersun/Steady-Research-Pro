import { describe, it, expect, vi, afterEach } from 'vitest';
import ResearchTaskProcessor from '../src/lib/research-processor.js';

const createProcessor = () =>
  new ResearchTaskProcessor({
    llmClient: {},
    searchClient: {},
    agents: {
      planningAgent: {},
      searchAgent: {},
      modelingAgent: {},
      reportAgent: {}
    }
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ResearchTaskProcessor deep agent configuration', () => {
  it('merges provider mapping and clamps sampling values', () => {
    const processor = createProcessor();
    const config = processor.resolveDeepAgentConfig(
      {
        sampling: {
          temperature: 3.4,
          topP: 1.5
        },
        providerMapping: {
          enabled: true,
          search: 'mapped-search-model',
          modeling: 'mapped-modeling-model',
          report: 'mapped-report-model'
        }
      },
      'fallback-model'
    );

    expect(config.enabled).toBe(true);
    expect(config.models.search).toBe('mapped-search-model');
    expect(config.models.modeling).toBe('mapped-modeling-model');
    expect(config.models.report).toBe('mapped-report-model');
    expect(config.sampling.temperature).toBe(2);
    expect(config.sampling.topP).toBe(1);
  });

  it('prefers explicit model overrides over provider mapping', () => {
    const processor = createProcessor();
    const config = processor.resolveDeepAgentConfig(
      {
        enabled: true,
        models: {
          search: 'coarse-search-model',
          modeling: 'coarse-modeling-model',
          report: 'coarse-report-model'
        },
        providerMapping: {
          enabled: true,
          search: 'mapped-search-model',
          modeling: 'mapped-modeling-model',
          report: 'mapped-report-model'
        }
      },
      'fallback-model'
    );

    expect(config.models.search).toBe('coarse-search-model');
    expect(config.models.modeling).toBe('coarse-modeling-model');
    expect(config.models.report).toBe('coarse-report-model');
  });

  it('falls back to base model when mapping is absent', () => {
    const processor = createProcessor();
    const config = processor.resolveDeepAgentConfig({}, 'default-model');

    expect(config.enabled).toBe(false);
    expect(config.models.search).toBe('default-model');
    expect(config.models.modeling).toBe('default-model');
    expect(config.models.report).toBe('default-model');
    expect(config.sampling.temperature).toBe(0.3);
    expect(config.sampling.topP).toBe(0.85);
  });
});

describe('ResearchTaskProcessor executePipeline', () => {
  it('marks completion payload when step metadata indicates fallback', async () => {
    const processor = createProcessor();
    const context = processor.buildExecutionContext('测试主题', 'base-model', {}, { enabled: true });
    const pipeline = [
      { id: 'search', stepType: 'deep_search', label: '搜索', weight: 1 }
    ];

    const events = [];
    vi.spyOn(processor, 'executeStep').mockImplementation(async (step, ctx, emitProgress) => {
      emitProgress({ ratio: 0.5, message: 'halfway' });
      return {
        output: `result-for-${step.id}`,
        metadata: {
          isFallback: true,
          fallbackReason: 'api_error'
        }
      };
    });

    await processor.executePipeline(pipeline, context, (stepId, status, progress, message, payload) => {
      events.push({ stepId, status, progress, message, payload });
    });

    const progressEvent = events.find((event) => event.status === 'progress');
    expect(progressEvent).toBeDefined();
    expect(progressEvent.payload.message).toBe('halfway');

    const completeEvent = events.find((event) => event.status === 'complete');
    expect(completeEvent).toBeDefined();
    expect(completeEvent.payload.fallback).toBe(true);
    expect(completeEvent.payload.result).toBe('result-for-search');
    expect(context.results.search).toBe('result-for-search');
    expect(context.results.deep_search).toBe('result-for-search');
  });
});

describe('ResearchTaskProcessor pipeline defaults', () => {
  it('returns a default pipeline including plan and synthesis steps', () => {
    const processor = createProcessor();
    const pipeline = processor.createDefaultPipeline();
    expect(pipeline[0]).toMatchObject({ id: 'plan', stepType: 'plan' });
    const finalStep = pipeline[pipeline.length - 1];
    expect(finalStep).toMatchObject({ id: 'synthesis', stepType: 'reporting', resultKey: 'reporting' });
  });

  it('falls back to heuristic plan when LLM client is missing', async () => {
    const processor = new ResearchTaskProcessor({ searchClient: {}, agents: {} });
    const context = processor.buildExecutionContext('缺少LLM的主题', 'base-model');
    const step = { id: 'plan', stepType: 'plan', label: '计划' };
    const result = await processor.executeStep(step, context, () => {});
    expect(result.metadata.isFallback).toBe(true);
    expect(result.output.content).toContain('缺少LLM的主题');
    expect(result.output.metadata.depth).toBeDefined();
  });
});
