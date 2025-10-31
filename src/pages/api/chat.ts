import type { APIRoute } from 'astro';
import { sendMessage, checkOllamaHealth } from '../../lib/ollama';

export const POST: APIRoute = async ({ request }) => {
  try {
    // 检查 Ollama 服务是否可用
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Ollama 服务不可用，请确保 Ollama 正在运行'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { message, model } = body;

    if (!message) {
      return new Response(JSON.stringify({
        success: false,
        error: '消息内容不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await sendMessage(message, model);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API 路由错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};