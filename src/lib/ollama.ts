import { Ollama } from 'ollama';
import { OLLAMA_CONFIG, ERROR_MESSAGES } from './config';

// Create Ollama instance
export const ollama = new Ollama({ host: OLLAMA_CONFIG.HOST });

// Check if Ollama service is available
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.HOST}${OLLAMA_CONFIG.ENDPOINTS.HEALTH}`);
    return response.ok;
  } catch (error) {
    console.error(ERROR_MESSAGES.SERVICE_UNAVAILABLE, error);
    return false;
  }
}

// Get list of available models
export async function getAvailableModels() {
  try {
    const models = await ollama.list();
    return models.models || [];
  } catch (error) {
    console.error('Failed to get model list:', error);
    return [];
  }
}

// Send message to Ollama
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
    console.error('Failed to send message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      model: model
    };
  }
}

// Send message to Ollama with streaming
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
    console.error('Failed to send streaming message:', error);
    throw error;
  }
}