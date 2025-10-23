import httpApiClient from './http-api.js';

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

  if (typeof fallback === 'string' && fallback.trim().length) {
    return [{ role: 'user', content: fallback }];
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
  return typeof fallback === 'string' ? fallback : '';
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

export { HttpLLMClient, normalizeSampling };

export default HttpLLMClient;
