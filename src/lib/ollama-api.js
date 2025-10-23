// Ollama 前端客户端
class OllamaAPI {
  constructor() {
    this.baseUrl = '/api';
  }

  /**
   * 检查 Ollama 服务状态
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/ollama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health' }),
      });
      const data = await response.json();
      return data.healthy;
    } catch (error) {
      console.error('检查服务状态失败:', error);
      return false;
    }
  }

  /**
   * 获取可用模型列表
   */
  async getModels() {
    try {
      const response = await fetch(`${this.baseUrl}/ollama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'models' }),
      });
      const data = await response.json();
      return data.success ? data.models : [];
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return [];
    }
  }

  /**
   * 生成文本 (非流式)
   */
  async generate(model, prompt, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/ollama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          model,
          prompt,
          options,
        }),
      });
      const data = await response.json();
      return data.success ? data.response : null;
    } catch (error) {
      console.error('生成文本失败:', error);
      throw error;
    }
  }

  /**
   * 流式生成文本
   */
  async generateStream(model, prompt, onChunk, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/ollama-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          model,
          prompt,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法获取响应流');
      }

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.chunk) {
                onChunk(data.chunk, false);
              } else if (data.done) {
                onChunk('', true);
                return;
              }
            } catch (e) {
              if (e instanceof SyntaxError) {
                // 忽略 JSON 解析错误，可能是不完整的数据
                continue;
              }
              throw e;
            }
          }
        }
      }
    } catch (error) {
      console.error('流式生成失败:', error);
      onChunk('', true, error);
    }
  }

  /**
   * 聊天对话 (非流式)
   */
  async chat(model, messages, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/ollama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          model,
          messages,
          options,
        }),
      });
      const data = await response.json();
      return data.success ? data.response : null;
    } catch (error) {
      console.error('聊天对话失败:', error);
      throw error;
    }
  }

  /**
   * 流式聊天对话
   */
  async chatStream(model, messages, onChunk, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/ollama-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          model,
          messages,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法获取响应流');
      }

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.chunk) {
                onChunk(data.chunk, false);
              } else if (data.done) {
                onChunk('', true);
                return;
              }
            } catch (e) {
              if (e instanceof SyntaxError) {
                // 忽略 JSON 解析错误，可能是不完整的数据
                continue;
              }
              throw e;
            }
          }
        }
      }
    } catch (error) {
      console.error('流式聊天失败:', error);
      onChunk('', true, error);
    }
  }

  /**
   * 拉取模型
   */
  async pullModel(model, onProgress) {
    try {
      const response = await fetch(`${this.baseUrl}/ollama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pull',
          model,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onProgress?.(100);
        return true;
      } else {
        throw new Error(data.error || '拉取模型失败');
      }
    } catch (error) {
      console.error('拉取模型失败:', error);
      throw error;
    }
  }
}

// 创建全局实例
window.ollamaAPI = new OllamaAPI();

export default OllamaAPI;
