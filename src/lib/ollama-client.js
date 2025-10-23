// Ollama 客户端封装
import { Ollama } from 'ollama';

const normalizeOptions = (options = {}) => {
  if (!options) return {};

  const { topP, top_p, topK, top_k, temperature, ...rest } = options;

  const normalized = { ...rest };

  if (typeof temperature === 'number') {
    normalized.temperature = temperature;
  }

  if (typeof top_p === 'number') {
    normalized.top_p = top_p;
  } else if (typeof topP === 'number') {
    normalized.top_p = topP;
  }

  if (typeof top_k === 'number') {
    normalized.top_k = top_k;
  } else if (typeof topK === 'number') {
    normalized.top_k = topK;
  }

  return normalized;
};

class OllamaClient {
  constructor() {
    this.ollama = new Ollama({
      host: 'http://127.0.0.1:11434', // 默认 Ollama 地址
    });
  }

  /**
   * 获取可用的模型列表
   */
  async getModels() {
    try {
      const response = await this.ollama.list();
      return response.models || [];
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return [];
    }
  }

  /**
   * 检查 Ollama 服务是否可用
   */
  async checkHealth() {
    try {
      await this.ollama.list();
      return true;
    } catch (error) {
      console.error('Ollama 服务不可用:', error);
      return false;
    }
  }

  /**
   * 生成文本
   * @param {string} model - 模型名称
   * @param {string} prompt - 提示词
   * @param {Object} options - 选项
   */
  async generate(model, prompt, options = {}) {
    try {
      const response = await this.ollama.generate({
        model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.7,
          top_p: options.top_p ?? options.topP ?? 0.9,
          ...normalizeOptions(options),
        },
      });
      return response.response;
    } catch (error) {
      console.error('文本生成失败:', error);
      throw error;
    }
  }

  /**
   * 流式生成文本
   * @param {string} model - 模型名称
   * @param {string} prompt - 提示词
   * @param {Function} callback - 流式回调函数
   * @param {Object} options - 选项
   */
  async generateStream(model, prompt, callback, options = {}) {
    try {
      const stream = await this.ollama.generate({
        model,
        prompt,
        stream: true,
        options: {
          temperature: options.temperature ?? 0.7,
          top_p: options.top_p ?? options.topP ?? 0.9,
          ...normalizeOptions(options),
        },
      });

      for await (const chunk of stream) {
        if (chunk.response) {
          callback(chunk.response, false);
        }
        if (chunk.done) {
          callback('', true);
          break;
        }
      }
    } catch (error) {
      console.error('流式生成失败:', error);
      callback('', true, error);
    }
  }

  /**
   * 聊天对话
   * @param {string} model - 模型名称
   * @param {Array} messages - 消息列表
   * @param {Object} options - 选项
   */
  async chat(model, messages, options = {}) {
    try {
      const response = await this.ollama.chat({
        model,
        messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.7,
          top_p: options.top_p ?? options.topP ?? 0.9,
          ...normalizeOptions(options),
        },
      });
      return response.message.content;
    } catch (error) {
      console.error('聊天对话失败:', error);
      throw error;
    }
  }

  /**
   * 流式聊天对话
   * @param {string} model - 模型名称
   * @param {Array} messages - 消息列表
   * @param {Function} callback - 流式回调函数
   * @param {Object} options - 选项
   */
  async chatStream(model, messages, callback, options = {}) {
    try {
      const stream = await this.ollama.chat({
        model,
        messages,
        stream: true,
        options: {
          temperature: options.temperature ?? 0.7,
          top_p: options.top_p ?? options.topP ?? 0.9,
          ...normalizeOptions(options),
        },
      });

      for await (const chunk of stream) {
        if (chunk.message?.content) {
          callback(chunk.message.content, false);
        }
        if (chunk.done) {
          callback('', true);
          break;
        }
      }
    } catch (error) {
      console.error('流式聊天失败:', error);
      callback('', true, error);
    }
  }

  /**
   * 拉取模型
   * @param {string} model - 模型名称
   * @param {Function} progressCallback - 进度回调
   */
  async pullModel(model, progressCallback) {
    try {
      const stream = await this.ollama.pull({
        model,
        stream: true,
      });

      for await (const chunk of stream) {
        if (progressCallback) {
          progressCallback(chunk);
        }
      }
      return true;
    } catch (error) {
      console.error('拉取模型失败:', error);
      throw error;
    }
  }
}

export default OllamaClient;
