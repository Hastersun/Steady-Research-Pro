/**
 * Unified LLM Provider Interface
 * Supports multiple cloud LLM providers: OpenAI, Anthropic, Google Gemini, Ollama, OpenLLM
 */

import { 
  OPENAI_CONFIG, 
  ANTHROPIC_CONFIG, 
  GOOGLE_CONFIG, 
  OLLAMA_CONFIG,
  OPENLLM_CONFIG,
  ERROR_MESSAGES,
  type LLMProvider 
} from './config';

// Response types
export interface LLMResponse {
  success: boolean;
  data?: string;
  error?: string;
  model: string;
  provider: LLMProvider;
}

export interface StreamChunk {
  content: string;
  done?: boolean;
}

// Message interface
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Provider interface
export interface ILLMProvider {
  sendMessage(message: string, model?: string): Promise<LLMResponse>;
  sendMessageStream(message: string, model?: string): AsyncIterable<StreamChunk>;
  checkHealth(): Promise<boolean>;
  getAvailableModels(): Promise<string[]>;
}

/**
 * OpenAI Provider
 */
export class OpenAIProvider implements ILLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = OPENAI_CONFIG.API_KEY;
    this.baseURL = OPENAI_CONFIG.BASE_URL;
  }

  async checkHealth(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.apiKey) return OPENAI_CONFIG.SUPPORTED_MODELS;
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      const data = await response.json();
      return data.data?.map((m: any) => m.id) || OPENAI_CONFIG.SUPPORTED_MODELS;
    } catch {
      return OPENAI_CONFIG.SUPPORTED_MODELS;
    }
  }

  async sendMessage(message: string, model: string = OPENAI_CONFIG.DEFAULT_MODEL): Promise<LLMResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: ERROR_MESSAGES.API_KEY_MISSING,
        model,
        provider: 'openai'
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: message }],
          ...OPENAI_CONFIG.GENERATION_CONFIG
        }),
        signal: AbortSignal.timeout(OPENAI_CONFIG.REQUEST_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.choices[0]?.message?.content || '',
        model,
        provider: 'openai'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
        model,
        provider: 'openai'
      };
    }
  }

  async *sendMessageStream(message: string, model: string = OPENAI_CONFIG.DEFAULT_MODEL): AsyncIterable<StreamChunk> {
    if (!this.apiKey) {
      yield { content: ERROR_MESSAGES.API_KEY_MISSING, done: true };
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: message }],
          ...OPENAI_CONFIG.GENERATION_CONFIG,
          stream: true
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data: /, '').trim();
          if (data === '[DONE]') {
            yield { content: '', done: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              yield { content };
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      yield { content: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR, done: true };
    }
  }
}

/**
 * Anthropic Claude Provider
 */
export class AnthropicProvider implements ILLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = ANTHROPIC_CONFIG.API_KEY;
    this.baseURL = ANTHROPIC_CONFIG.BASE_URL;
  }

  async checkHealth(): Promise<boolean> {
    return !!this.apiKey;
  }

  async getAvailableModels(): Promise<string[]> {
    return ANTHROPIC_CONFIG.SUPPORTED_MODELS;
  }

  async sendMessage(message: string, model: string = ANTHROPIC_CONFIG.DEFAULT_MODEL): Promise<LLMResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: ERROR_MESSAGES.API_KEY_MISSING,
        model,
        provider: 'anthropic'
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: message }],
          ...ANTHROPIC_CONFIG.GENERATION_CONFIG
        }),
        signal: AbortSignal.timeout(ANTHROPIC_CONFIG.REQUEST_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.content[0]?.text || '',
        model,
        provider: 'anthropic'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
        model,
        provider: 'anthropic'
      };
    }
  }

  async *sendMessageStream(message: string, model: string = ANTHROPIC_CONFIG.DEFAULT_MODEL): AsyncIterable<StreamChunk> {
    if (!this.apiKey) {
      yield { content: ERROR_MESSAGES.API_KEY_MISSING, done: true };
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: message }],
          ...ANTHROPIC_CONFIG.GENERATION_CONFIG,
          stream: true
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data: /, '').trim();
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta') {
              const content = parsed.delta?.text || '';
              if (content) {
                yield { content };
              }
            } else if (parsed.type === 'message_stop') {
              yield { content: '', done: true };
              return;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      yield { content: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR, done: true };
    }
  }
}

/**
 * Google Gemini Provider
 */
export class GoogleProvider implements ILLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = GOOGLE_CONFIG.API_KEY;
    this.baseURL = GOOGLE_CONFIG.BASE_URL;
  }

  async checkHealth(): Promise<boolean> {
    return !!this.apiKey;
  }

  async getAvailableModels(): Promise<string[]> {
    return GOOGLE_CONFIG.SUPPORTED_MODELS;
  }

  async sendMessage(message: string, model: string = GOOGLE_CONFIG.DEFAULT_MODEL): Promise<LLMResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: ERROR_MESSAGES.API_KEY_MISSING,
        model,
        provider: 'google'
      };
    }

    try {
      const response = await fetch(
        `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
            generationConfig: GOOGLE_CONFIG.GENERATION_CONFIG
          }),
          signal: AbortSignal.timeout(GOOGLE_CONFIG.REQUEST_TIMEOUT)
        }
      );

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.candidates[0]?.content?.parts[0]?.text || '',
        model,
        provider: 'google'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
        model,
        provider: 'google'
      };
    }
  }

  async *sendMessageStream(message: string, model: string = GOOGLE_CONFIG.DEFAULT_MODEL): AsyncIterable<StreamChunk> {
    if (!this.apiKey) {
      yield { content: ERROR_MESSAGES.API_KEY_MISSING, done: true };
      return;
    }

    try {
      const response = await fetch(
        `${this.baseURL}/models/${model}:streamGenerateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
            generationConfig: GOOGLE_CONFIG.GENERATION_CONFIG
          })
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          yield { content: '', done: true };
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (content) {
              yield { content };
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      yield { content: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR, done: true };
    }
  }
}

/**
 * Ollama Provider (existing implementation wrapped)
 */
export class OllamaProvider implements ILLMProvider {
  private ollama: any;

  constructor() {
    // Dynamically import to avoid issues
    import('ollama').then(({ Ollama }) => {
      this.ollama = new Ollama({ host: OLLAMA_CONFIG.HOST });
    });
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${OLLAMA_CONFIG.HOST}${OLLAMA_CONFIG.ENDPOINTS.HEALTH}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.ollama.list();
      return models.models?.map((m: any) => m.name) || OLLAMA_CONFIG.FALLBACK_MODELS;
    } catch {
      return OLLAMA_CONFIG.FALLBACK_MODELS;
    }
  }

  async sendMessage(message: string, model: string = OLLAMA_CONFIG.DEFAULT_MODEL): Promise<LLMResponse> {
    try {
      const response = await this.ollama.chat({
        model,
        messages: [{ role: 'user', content: message }],
      });
      
      return {
        success: true,
        data: response.message.content,
        model,
        provider: 'ollama'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
        model,
        provider: 'ollama'
      };
    }
  }

  async *sendMessageStream(message: string, model: string = OLLAMA_CONFIG.DEFAULT_MODEL): AsyncIterable<StreamChunk> {
    try {
      const stream = await this.ollama.chat({
        model,
        messages: [{ role: 'user', content: message }],
        stream: true,
      });
      
      for await (const part of stream) {
        if (part.message?.content) {
          yield { content: part.message.content };
        }
      }
      yield { content: '', done: true };
    } catch (error) {
      yield { 
        content: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR, 
        done: true 
      };
    }
  }
}

/**
 * Provider Factory
 */
export function createLLMProvider(provider: LLMProvider): ILLMProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'google':
      return new GoogleProvider();
    case 'ollama':
      return new OllamaProvider();
    case 'openllm':
      // For OpenLLM, use the existing implementation
      return new OllamaProvider(); // Same interface, different backend
    default:
      throw new Error(ERROR_MESSAGES.PROVIDER_NOT_SUPPORTED);
  }
}

/**
 * Unified interface for sending messages
 */
export async function sendUnifiedMessage(
  message: string,
  provider: LLMProvider = 'ollama',
  model?: string
): Promise<LLMResponse> {
  if (!message.trim()) {
    return {
      success: false,
      error: ERROR_MESSAGES.EMPTY_MESSAGE,
      model: model || '',
      provider
    };
  }

  const llmProvider = createLLMProvider(provider);
  const isHealthy = await llmProvider.checkHealth();
  
  if (!isHealthy) {
    return {
      success: false,
      error: `${provider} service is unavailable`,
      model: model || '',
      provider
    };
  }

  return await llmProvider.sendMessage(message, model);
}

/**
 * Unified interface for streaming messages
 */
export async function* sendUnifiedMessageStream(
  message: string,
  provider: LLMProvider = 'ollama',
  model?: string
): AsyncIterable<StreamChunk> {
  if (!message.trim()) {
    yield { content: ERROR_MESSAGES.EMPTY_MESSAGE, done: true };
    return;
  }

  const llmProvider = createLLMProvider(provider);
  yield* llmProvider.sendMessageStream(message, model);
}
