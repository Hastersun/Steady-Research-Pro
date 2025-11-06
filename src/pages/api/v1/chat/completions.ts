import type { APIRoute } from 'astro';
import { sendMessage, checkOllamaHealth } from '../../../../lib/ollama';

/**
 * OpenAI-compatible Chat Completions API
 * POST /api/v1/chat/completions
 * 
 * Compatible with OpenAI's chat completions format:
 * https://platform.openai.com/docs/api-reference/chat/create
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Ollama service is available
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return new Response(JSON.stringify({
        error: {
          message: 'Ollama service is unavailable. Please make sure Ollama is running.',
          type: 'service_unavailable',
          code: 'ollama_unavailable'
        }
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { 
      messages, 
      model = 'llama2',
      temperature = 0.7,
      max_tokens,
      stream = false,
      top_p,
      frequency_penalty,
      presence_penalty,
      n = 1,
      user
    } = body;

    // Validate messages format
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({
        error: {
          message: 'Messages must be a non-empty array',
          type: 'invalid_request_error',
          code: 'invalid_messages'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(JSON.stringify({
          error: {
            message: 'Each message must have "role" and "content" fields',
            type: 'invalid_request_error',
            code: 'invalid_message_format'
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Convert messages to a single prompt (simplified version)
    // In production, you'd want more sophisticated message handling
    const prompt = messages
      .map((msg: any) => {
        if (msg.role === 'system') return `System: ${msg.content}`;
        if (msg.role === 'user') return `User: ${msg.content}`;
        if (msg.role === 'assistant') return `Assistant: ${msg.content}`;
        return msg.content;
      })
      .join('\n\n');

    // Handle streaming
    if (stream) {
      // For streaming, we need to use Server-Sent Events
      // This is a simplified version - production would need proper streaming
      return new Response(JSON.stringify({
        error: {
          message: 'Streaming is not yet implemented in this endpoint. Use /api/chat/stream instead.',
          type: 'not_implemented',
          code: 'streaming_not_supported'
        }
      }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send message to Ollama
    const result = await sendMessage(prompt, model);

    if (!result.success) {
      return new Response(JSON.stringify({
        error: {
          message: result.error || 'Failed to generate response',
          type: 'api_error',
          code: 'generation_failed'
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format response in OpenAI-compatible format
    const responseContent = 'data' in result ? result.data : '';
    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseContent
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: -1, // Ollama doesn't provide token counts
        completion_tokens: -1,
        total_tokens: -1
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Chat completions API error:', error);
    return new Response(JSON.stringify({
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        type: 'internal_error',
        code: 'server_error'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
