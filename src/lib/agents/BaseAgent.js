// 通用 Agent 基类，用于深度研究工作流
export default class BaseAgent {
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
