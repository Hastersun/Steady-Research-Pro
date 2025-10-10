// API endpoint for HTTP-based AI services
import httpApiClient from '../../lib/http-api.js';

export async function POST({ request }) {
  try {
    const {
      message,
      provider,
      systemPrompt,
      stream = false,
      apiKey,
      model,
      sampling,
      messages
    } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!provider || provider === 'ollama') {
      return new Response(
        JSON.stringify({ error: 'Invalid provider for HTTP API' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (typeof apiKey === 'string' && apiKey.trim().length > 0) {
      try {
        httpApiClient.setApiKey(provider, apiKey.trim());
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message, provider }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // 检查是否支持流式响应
    if (stream && (provider === 'deepseek' || provider === 'openai')) {
      // 流式响应
      const responseStream = new ReadableStream({
        async start(controller) {
          try {
            await httpApiClient.sendStreamingRequest(
              message,
              {
                service: provider,
                systemPrompt,
                model,
                sampling,
                messages,
                mode: Array.isArray(messages) ? 'chat' : 'generate'
              },
              (chunk) => {
                // 发送流式数据
                const data = `data: ${JSON.stringify({ chunk })}\n\n`;
                controller.enqueue(new TextEncoder().encode(data));
              }
            );
            
            // 发送结束标记
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            const errorData = `data: ${JSON.stringify({ error: error.message })}\n\n`;
            controller.enqueue(new TextEncoder().encode(errorData));
            controller.close();
          }
        }
      });

      return new Response(responseStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      });
    } else {
      // 常规响应
      const response = await httpApiClient.sendRequest(message, {
        service: provider,
        systemPrompt,
        model,
        sampling,
        messages,
        mode: Array.isArray(messages) ? 'chat' : 'generate'
      });

      return new Response(
        JSON.stringify({ 
          response,
          provider,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('HTTP API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        provider: request.provider || 'unknown'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// GET endpoint for service status
export async function GET() {
  try {
    const status = await httpApiClient.getServiceStatus();
    
    return new Response(
      JSON.stringify({ 
        status,
        services: httpApiClient.getAvailableServices(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Status check error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to check service status',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}