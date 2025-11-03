import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendUnifiedMessage, sendUnifiedMessageStream, createLLMProvider } from '../lib/llm-providers.js';
import { DEFAULT_LLM_PROVIDER, type LLMProvider } from '../lib/config.js';

const router = Router();

/**
 * POST /api/chat
 * Send chat message (non-streaming)
 * Body: { message: string, model?: string, provider?: LLMProvider }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, model, provider = DEFAULT_LLM_PROVIDER } = req.body;

    // Validate message content
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content cannot be empty'
      });
    }

    // Validate provider
    const validProviders: LLMProvider[] = ['ollama', 'openai', 'anthropic', 'google', 'openllm'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        error: `Invalid provider. Supported providers: ${validProviders.join(', ')}`
      });
    }

    // Check provider health
    const llmProvider = createLLMProvider(provider);
    const isHealthy = await llmProvider.checkHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: `${provider} service is unavailable or API key is missing`,
        provider
      });
    }

    // Send message
    const result = await sendUnifiedMessage(message, provider, model);

    return res.status(result.success ? 200 : 500).json(result);

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/chat/stream
 * Send chat message (streaming response)
 * Body: { message: string, model?: string, provider?: LLMProvider }
 */
router.post('/stream', async (req: Request, res: Response) => {
  try {
    const { message, model, provider = DEFAULT_LLM_PROVIDER } = req.body;

    // Validate message content
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content cannot be empty'
      });
    }

    // Validate provider
    const validProviders: LLMProvider[] = ['ollama', 'openai', 'anthropic', 'google', 'openllm'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        error: `Invalid provider. Supported providers: ${validProviders.join(', ')}`
      });
    }

    // Check provider health
    const llmProvider = createLLMProvider(provider);
    const isHealthy = await llmProvider.checkHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: `${provider} service is unavailable or API key is missing`,
        provider
      });
    }

    // Set streaming response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get streaming response
    const stream = sendUnifiedMessageStream(message, provider, model);

    // Send streaming data
    for await (const chunk of stream) {
      if (chunk.content) {
        res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
      }
      if (chunk.done) {
        break;
      }
    }

    // Send completion marker
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Streaming chat API error:', error);
    
    // If headers not sent yet, send error response
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
    
    // If streaming already started, send error event
    res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Streaming error' })}\n\n`);
    res.end();
  }
});

/**
 * GET /api/chat/providers
 * Get list of available LLM providers and their status
 */
router.get('/providers', async (req: Request, res: Response) => {
  try {
    const providers: LLMProvider[] = ['ollama', 'openai', 'anthropic', 'google', 'openllm'];
    const providerStatus = await Promise.all(
      providers.map(async (provider) => {
        try {
          const llmProvider = createLLMProvider(provider);
          const isHealthy = await llmProvider.checkHealth();
          const models = isHealthy ? await llmProvider.getAvailableModels() : [];
          return {
            name: provider,
            available: isHealthy,
            models
          };
        } catch {
          return {
            name: provider,
            available: false,
            models: []
          };
        }
      })
    );

    res.json({
      success: true,
      providers: providerStatus,
      default: DEFAULT_LLM_PROVIDER
    });
  } catch (error) {
    console.error('Provider list API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

export default router;
