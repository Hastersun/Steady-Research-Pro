// Ollama configuration file
export const OLLAMA_CONFIG = {
  // Ollama server address
  HOST: 'http://localhost:11434',
  
  // Default model
  DEFAULT_MODEL: 'llama2',
  
  // Supported models list (fallback when Ollama service is unavailable)
  FALLBACK_MODELS: [
    'llama2',
    'llama2:13b',
    'codellama',
    'mistral',
    'neural-chat',
    'starling-lm'
  ],
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/api/version',
    MODELS: '/api/tags',
    CHAT: '/api/chat',
    GENERATE: '/api/generate'
  },
  
  // Request configuration
  REQUEST_TIMEOUT: 30000, // 30 seconds timeout
  
  // Streaming response configuration
  STREAM_CONFIG: {
    enabled: true,
    chunkSize: 1024
  }
};

// OpenLLM configuration file
export const OPENLLM_CONFIG = {
  // OpenLLM server address (compatible with OpenAI API format)
  BASE_URL: 'http://localhost:3000',
  
  // Default model
  DEFAULT_MODEL: 'facebook/opt-1.3b',
  
  // Supported models list
  SUPPORTED_MODELS: [
    'facebook/opt-1.3b',
    'facebook/opt-2.7b',
    'facebook/opt-6.7b',
    'meta-llama/Llama-2-7b-hf',
    'meta-llama/Llama-2-13b-hf',
    'tiiuae/falcon-7b',
    'tiiuae/falcon-40b',
    'mistralai/Mistral-7B-v0.1',
  ],
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    MODELS: '/v1/models',
    CHAT: '/v1/chat/completions',
    COMPLETIONS: '/v1/completions',
  },
  
  // Request configuration
  REQUEST_TIMEOUT: 60000, // 60 seconds timeout
  
  // Generation configuration
  GENERATION_CONFIG: {
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  
  // Streaming response configuration
  STREAM_CONFIG: {
    enabled: true,
  }
};

// Cloud LLM Provider Types
export type LLMProvider = 'ollama' | 'openai' | 'anthropic' | 'google' | 'openllm';

// OpenAI configuration
export const OPENAI_CONFIG = {
  API_KEY: import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
  BASE_URL: 'https://api.openai.com/v1',
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  SUPPORTED_MODELS: [
    'gpt-4-turbo-preview',
    'gpt-4',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
  ],
  GENERATION_CONFIG: {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  REQUEST_TIMEOUT: 60000,
};

// Anthropic Claude configuration
export const ANTHROPIC_CONFIG = {
  API_KEY: import.meta.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || '',
  BASE_URL: 'https://api.anthropic.com/v1',
  DEFAULT_MODEL: 'claude-3-sonnet-20240229',
  SUPPORTED_MODELS: [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
  ],
  GENERATION_CONFIG: {
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 1,
  },
  REQUEST_TIMEOUT: 60000,
};

// Google Gemini configuration
export const GOOGLE_CONFIG = {
  API_KEY: import.meta.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || '',
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  DEFAULT_MODEL: 'gemini-pro',
  SUPPORTED_MODELS: [
    'gemini-pro',
    'gemini-pro-vision',
    'gemini-ultra',
  ],
  GENERATION_CONFIG: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    topP: 0.8,
    topK: 40,
  },
  REQUEST_TIMEOUT: 60000,
};

// Default LLM Provider
export const DEFAULT_LLM_PROVIDER: LLMProvider = 'ollama';

// Error messages configuration
export const ERROR_MESSAGES = {
  SERVICE_UNAVAILABLE: 'Ollama service is unavailable, please make sure Ollama is running',
  OPENLLM_UNAVAILABLE: 'OpenLLM service is unavailable, please make sure OpenLLM is running',
  OPENAI_UNAVAILABLE: 'OpenAI service is unavailable, please check your API key',
  ANTHROPIC_UNAVAILABLE: 'Anthropic service is unavailable, please check your API key',
  GOOGLE_UNAVAILABLE: 'Google Gemini service is unavailable, please check your API key',
  MODEL_NOT_FOUND: 'The specified model was not found',
  TIMEOUT: 'Request timed out, please try again later',
  NETWORK_ERROR: 'Network connection error',
  INVALID_REQUEST: 'Invalid request format',
  EMPTY_MESSAGE: 'Message content cannot be empty',
  PROVIDER_NOT_SUPPORTED: 'The specified LLM provider is not supported',
  API_KEY_MISSING: 'API key is missing for the selected provider'
};