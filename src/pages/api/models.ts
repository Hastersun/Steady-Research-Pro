import type { APIRoute } from 'astro';
import { getAvailableModels, checkOllamaHealth } from '../../lib/ollama';

export const GET: APIRoute = async () => {
  try {
    // 检查 Ollama 服务是否可用
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Ollama 服务不可用，请确保 Ollama 正在运行',
        models: []
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const models = await getAvailableModels();

    return new Response(JSON.stringify({
      success: true,
      models: models
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('获取模型列表错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误',
      models: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};