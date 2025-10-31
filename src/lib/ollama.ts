import { Ollama } from 'ollama';
import { OLLAMA_CONFIG, ERROR_MESSAGES } from './config';

// 创建 Ollama 实例
export const ollama = new Ollama({ host: OLLAMA_CONFIG.HOST });

// 检查 Ollama 服务是否可用
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.HOST}${OLLAMA_CONFIG.ENDPOINTS.HEALTH}`);
    return response.ok;
  } catch (error) {
    console.error(ERROR_MESSAGES.SERVICE_UNAVAILABLE, error);
    return false;
  }
}

// 获取可用模型列表
export async function getAvailableModels() {
  try {
    const models = await ollama.list();
    return models.models || [];
  } catch (error) {
    console.error('获取模型列表失败:', error);
    return [];
  }
}

// 发送消息到 Ollama
export async function sendMessage(message: string, model: string = OLLAMA_CONFIG.DEFAULT_MODEL) {
  if (!message.trim()) {
    return {
      success: false,
      error: ERROR_MESSAGES.EMPTY_MESSAGE,
      model: model
    };
  }

  try {
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: message }],
    });
    
    return {
      success: true,
      data: response.message.content,
      model: model
    };
  } catch (error) {
    console.error('发送消息失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      model: model
    };
  }
}

// 流式发送消息到 Ollama
export async function sendMessageStream(message: string, model: string = OLLAMA_CONFIG.DEFAULT_MODEL) {
  if (!message.trim()) {
    throw new Error(ERROR_MESSAGES.EMPTY_MESSAGE);
  }

  try {
    const stream = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: message }],
      stream: true,
    });
    
    return stream;
  } catch (error) {
    console.error('流式发送消息失败:', error);
    throw error;
  }
}