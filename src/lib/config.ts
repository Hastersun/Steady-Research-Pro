// Ollama 配置文件
export const OLLAMA_CONFIG = {
  // Ollama 服务器地址
  HOST: 'http://localhost:11434',
  
  // 默认模型
  DEFAULT_MODEL: 'llama2',
  
  // 支持的模型列表（如果 Ollama 服务不可用时的备选）
  FALLBACK_MODELS: [
    'llama2',
    'llama2:13b',
    'codellama',
    'mistral',
    'neural-chat',
    'starling-lm'
  ],
  
  // API 端点
  ENDPOINTS: {
    HEALTH: '/api/version',
    MODELS: '/api/tags',
    CHAT: '/api/chat',
    GENERATE: '/api/generate'
  },
  
  // 请求配置
  REQUEST_TIMEOUT: 30000, // 30秒超时
  
  // 流式响应配置
  STREAM_CONFIG: {
    enabled: true,
    chunkSize: 1024
  }
};

// OpenLLM 配置文件
export const OPENLLM_CONFIG = {
  // OpenLLM 服务器地址（兼容 OpenAI API 格式）
  BASE_URL: 'http://localhost:3000',
  
  // 默认模型
  DEFAULT_MODEL: 'facebook/opt-1.3b',
  
  // 支持的模型列表
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
  
  // API 端点
  ENDPOINTS: {
    HEALTH: '/health',
    MODELS: '/v1/models',
    CHAT: '/v1/chat/completions',
    COMPLETIONS: '/v1/completions',
  },
  
  // 请求配置
  REQUEST_TIMEOUT: 60000, // 60秒超时
  
  // 生成配置
  GENERATION_CONFIG: {
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  
  // 流式响应配置
  STREAM_CONFIG: {
    enabled: true,
  }
};

// 错误消息配置
export const ERROR_MESSAGES = {
  SERVICE_UNAVAILABLE: 'Ollama 服务不可用，请确保 Ollama 正在运行',
  OPENLLM_UNAVAILABLE: 'OpenLLM 服务不可用，请确保 OpenLLM 正在运行',
  MODEL_NOT_FOUND: '指定的模型未找到',
  TIMEOUT: '请求超时，请稍后重试',
  NETWORK_ERROR: '网络连接错误',
  INVALID_REQUEST: '请求格式无效',
  EMPTY_MESSAGE: '消息内容不能为空'
};