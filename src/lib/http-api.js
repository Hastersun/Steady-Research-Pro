// HTTP API client for various AI services
// Supports DeepSeek, OpenAI, Claude, and Gemini

/**
 * AI Service Configuration
 */
const AI_SERVICES = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {{API_KEY}}'
    }
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {{API_KEY}}'
    }
  },
  claude: {
    baseUrl: 'https://api.anthropic.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '{{API_KEY}}',
      'anthropic-version': '2023-06-01'
    }
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

/**
 * Default model configurations for each service
 */
const DEFAULT_MODELS = {
  deepseek: 'deepseek-chat',
  openai: 'gpt-3.5-turbo',
  claude: 'claude-3-haiku-20240307',
  gemini: 'gemini-1.5-flash-latest'
};

/**
 * HTTP API Client for AI Services
 */
class HttpApiClient {
  constructor() {
    this.apiKeys = {};
    this.defaultService = 'deepseek';
  }

  /**
   * Set API key for a specific service
   * @param {string} service - Service name (deepseek, openai, claude, gemini)
   * @param {string} apiKey - API key
   */
  setApiKey(service, apiKey) {
    if (!AI_SERVICES[service]) {
      throw new Error(`Unsupported service: ${service}`);
    }
    this.apiKeys[service] = apiKey;
  }

  /**
   * Set default service
   * @param {string} service - Service name
   */
  setDefaultService(service) {
    if (!AI_SERVICES[service]) {
      throw new Error(`Unsupported service: ${service}`);
    }
    this.defaultService = service;
  }

  /**
   * Get available services
   * @returns {string[]} Array of service names
   */
  getAvailableServices() {
    return Object.keys(AI_SERVICES);
  }

  /**
   * Check if API key is set for a service
   * @param {string} service - Service name
   * @returns {boolean} True if API key is set
   */
  hasApiKey(service) {
    return Boolean(this.apiKeys[service]);
  }

  /**
   * Build request headers for a service
   * @param {string} service - Service name
   * @returns {object} Request headers
   */
  buildHeaders(service) {
    const config = AI_SERVICES[service];
    const headers = { ...config.headers };
    const apiKey = this.apiKeys[service];

    if (!apiKey) {
      throw new Error(`API key not set for service: ${service}`);
    }

    // Replace API key placeholder
    Object.keys(headers).forEach(key => {
      if (headers[key].includes('{{API_KEY}}')) {
        headers[key] = headers[key].replace('{{API_KEY}}', apiKey);
      }
    });

    return headers;
  }

  /**
   * Build request URL for different services
   * @param {string} service - Service name
   * @param {string} endpoint - API endpoint
   * @param {object} params - URL parameters for Gemini
   * @returns {string} Complete URL
   */
  buildUrl(service, endpoint, params = {}) {
    const config = AI_SERVICES[service];
    let url = `${config.baseUrl}/${endpoint}`;

    // Special handling for Gemini
    if (service === 'gemini') {
      const apiKey = this.apiKeys[service];
      if (!apiKey) {
        throw new Error(`API key not set for service: ${service}`);
      }
      
      const urlParams = new URLSearchParams({ key: apiKey });
      if (Object.keys(params).length > 0) {
        Object.entries(params).forEach(([key, value]) => {
          urlParams.append(key, value);
        });
      }
      url += `?${urlParams.toString()}`;
    }

    return url;
  }

  /**
   * Format message for different services
   * @param {string} service - Service name
   * @param {string} message - User message
   * @param {string} systemPrompt - System prompt (optional)
   * @returns {object} Formatted request payload
   */
  formatRequest(service, {
    message = '',
    systemPrompt = null,
    model,
    sampling = {},
    messages = [],
    mode = 'generate'
  } = {}) {
    const resolvedModel = typeof model === 'string' && model.trim().length
      ? model
      : DEFAULT_MODELS[service];

    const ensureNumber = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined);
    const normalizeMessages = (rawMessages = []) => {
      if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
        return [];
      }
      return rawMessages
        .map((item) => {
          if (!item) return null;
          if (typeof item === 'string') {
            return { role: 'user', content: item };
          }
          const role = typeof item.role === 'string' ? item.role : 'user';
          const content = typeof item.content === 'string' ? item.content : '';
          if (!content) return null;
          return { role, content };
        })
        .filter(Boolean);
    };

    const toClaudeContent = (rawMessages, fallback) => {
      const normalized = normalizeMessages(rawMessages);
      if (normalized.length) {
        return normalized.map((item) => ({
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: item.content
        }));
      }
      if (fallback) {
        return [{ role: 'user', content: fallback }];
      }
      return [];
    };

    const combineForGemini = (rawMessages, fallback) => {
      const normalized = normalizeMessages(rawMessages);
      if (normalized.length) {
        return normalized.map(({ role, content }) => ({ text: `${role}: ${content}` }));
      }
      return [{ text: fallback }];
    };

    switch (service) {
      case 'deepseek':
      case 'openai': {
        const chatMessages = [];
        if (systemPrompt) {
          chatMessages.push({ role: 'system', content: systemPrompt });
        }
        const normalized = normalizeMessages(messages);
        if (normalized.length) {
          chatMessages.push(...normalized);
        } else {
          chatMessages.push({ role: 'user', content: message });
        }

        const payload = {
          model: resolvedModel,
          messages: chatMessages,
          temperature: ensureNumber(sampling.temperature) ?? 0.7,
          max_tokens: ensureNumber(sampling.maxTokens) ?? 4000
        };

        const topP = ensureNumber(sampling.top_p ?? sampling.topP);
        if (typeof topP === 'number') {
          payload.top_p = topP;
        }

        const presencePenalty = ensureNumber(sampling.presence_penalty ?? sampling.presencePenalty);
        if (typeof presencePenalty === 'number') {
          payload.presence_penalty = presencePenalty;
        }

        const frequencyPenalty = ensureNumber(sampling.frequency_penalty ?? sampling.frequencyPenalty);
        if (typeof frequencyPenalty === 'number') {
          payload.frequency_penalty = frequencyPenalty;
        }

        return payload;
      }

      case 'claude': {
        const payload = {
          model: resolvedModel,
          max_tokens: ensureNumber(sampling.maxTokens) ?? 4000,
          messages: toClaudeContent(messages, message),
          system: systemPrompt || 'You are a helpful AI assistant.'
        };

        const temperature = ensureNumber(sampling.temperature);
        if (typeof temperature === 'number') {
          payload.temperature = temperature;
        }

        return payload;
      }

      case 'gemini': {
        const parts = combineForGemini(messages, message);
        const temperature = ensureNumber(sampling.temperature) ?? 0.7;
        const topP = ensureNumber(sampling.top_p ?? sampling.topP);
        const topK = ensureNumber(sampling.top_k ?? sampling.topK);
        const generationConfig = {
          temperature,
          maxOutputTokens: ensureNumber(sampling.maxTokens) ?? 4000
        };

        if (typeof topP === 'number') {
          generationConfig.topP = topP;
        }
        if (typeof topK === 'number') {
          generationConfig.topK = topK;
        }

        return {
          contents: [
            {
              parts
            }
          ],
          generationConfig
        };
      }

      default:
        throw new Error(`Unsupported service: ${service}`);
    }
  }

  /**
   * Parse response from different services
   * @param {string} service - Service name
   * @param {object} response - API response
   * @returns {string} Extracted text content
   */
  parseResponse(service, response) {
    try {
      switch (service) {
        case 'deepseek':
        case 'openai':
          return response.choices?.[0]?.message?.content || '';

        case 'claude':
          return response.content?.[0]?.text || '';

        case 'gemini':
          return response.candidates?.[0]?.content?.parts?.[0]?.text || '';

        default:
          throw new Error(`Unsupported service: ${service}`);
      }
    } catch (error) {
      console.error(`Error parsing response from ${service}:`, error);
      return '';
    }
  }

  /**
   * Get the appropriate endpoint for each service
   * @param {string} service - Service name
   * @returns {string} API endpoint
   */
  getEndpoint(service) {
    switch (service) {
      case 'deepseek':
      case 'openai':
        return 'chat/completions';
      case 'claude':
        return 'messages';
      case 'gemini':
        const model = DEFAULT_MODELS[service];
        return `models/${model}:generateContent`;
      default:
        throw new Error(`Unsupported service: ${service}`);
    }
  }

  /**
   * Send request to AI service
   * @param {string} message - User message
   * @param {object} options - Request options
   * @returns {Promise<string>} AI response
   */
  async sendRequest(message, options = {}) {
    const {
      service = this.defaultService,
      systemPrompt = null,
      model = null,
      sampling = {},
      messages = null,
      mode = 'generate',
      stream = false
    } = options;

    if (!this.hasApiKey(service)) {
      throw new Error(`API key not set for service: ${service}`);
    }

    try {
      const endpoint = this.getEndpoint(service);
      const url = this.buildUrl(service, endpoint);
      const headers = service === 'gemini' ? 
        { 'Content-Type': 'application/json' } : 
        this.buildHeaders(service);
      
      const payload = this.formatRequest(service, {
        message,
        systemPrompt,
        model,
        sampling,
        messages,
        mode
      });
      
      // Add streaming support for compatible services
      if (stream && (service === 'deepseek' || service === 'openai')) {
        payload.stream = true;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`${service} API error (${response.status}): ${errorData}`);
      }

      const data = await response.json();
      return this.parseResponse(service, data);

    } catch (error) {
      console.error(`Error calling ${service} API:`, error);
      throw error;
    }
  }

  /**
   * Send streaming request to AI service
   * @param {string} message - User message
   * @param {object} options - Request options
   * @param {function} onChunk - Callback for each chunk
   * @returns {Promise<string>} Complete response
   */
  async sendStreamingRequest(message, options = {}, onChunk = null) {
    const {
      service = this.defaultService,
      systemPrompt = null,
      model = null,
      sampling = {},
      messages = null,
      mode = 'generate'
    } = options;

    // Only DeepSeek and OpenAI support streaming
    if (service !== 'deepseek' && service !== 'openai') {
      // Fall back to regular request
      return this.sendRequest(message, {
        ...options,
        stream: false
      });
    }

    if (!this.hasApiKey(service)) {
      throw new Error(`API key not set for service: ${service}`);
    }

    try {
      const endpoint = this.getEndpoint(service);
      const url = this.buildUrl(service, endpoint);
      const headers = this.buildHeaders(service);
      
      const payload = this.formatRequest(service, {
        message,
        systemPrompt,
        model,
        sampling,
        messages,
        mode
      });
      payload.stream = true;

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`${service} API error (${response.status}): ${errorData}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                if (onChunk) {
                  onChunk(content);
                }
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      return fullResponse;

    } catch (error) {
      console.error(`Error calling ${service} streaming API:`, error);
      throw error;
    }
  }

  /**
   * Test connection to a service
   * @param {string} service - Service name
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection(service) {
    try {
      const response = await this.sendRequest('Hello', { service });
      return Boolean(response && response.trim().length > 0);
    } catch (error) {
      console.error(`Connection test failed for ${service}:`, error);
      return false;
    }
  }

  /**
   * Get service status
   * @returns {Promise<object>} Status for all services
   */
  async getServiceStatus() {
    const status = {};
    const services = this.getAvailableServices();

    for (const service of services) {
      if (this.hasApiKey(service)) {
        status[service] = {
          hasApiKey: true,
          connected: await this.testConnection(service)
        };
      } else {
        status[service] = {
          hasApiKey: false,
          connected: false
        };
      }
    }

    return status;
  }
}

// Create and export singleton instance
const httpApiClient = new HttpApiClient();

// Export client and utilities
export { httpApiClient, HttpApiClient, AI_SERVICES, DEFAULT_MODELS };

// Default export
export default httpApiClient;