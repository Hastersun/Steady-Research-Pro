import type { APIRoute } from 'astro';
import { sendMessage, checkOllamaHealth } from '../../lib/ollama';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Ollama service is available
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Ollama service is unavailable, please make sure Ollama is running'
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
        error: 'Message content cannot be empty'
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
    console.error('API route error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};