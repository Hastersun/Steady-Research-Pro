import type { APIRoute } from 'astro';
import { getAvailableModels, checkOllamaHealth } from '../../lib/ollama';

export const GET: APIRoute = async () => {
  try {
    // Check if Ollama service is available
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Ollama service is unavailable, please make sure Ollama is running',
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
    console.error('Error getting model list:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      models: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};