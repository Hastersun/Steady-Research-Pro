import { Router } from 'express';
import type { Request, Response } from 'express';
import { getAvailableModels, checkOllamaHealth } from '../lib/ollama.js';

const router = Router();

/**
 * GET /api/models
 * Get list of available models
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check if Ollama service is available
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Ollama service is unavailable, please make sure Ollama is running',
        models: []
      });
    }

    // Get model list
    const models = await getAvailableModels();

    return res.json({
      success: true,
      models: models.map((model: any) => ({
        name: model.name,
        size: model.size,
        modified_at: model.modified_at,
        digest: model.digest
      })),
      count: models.length
    });

  } catch (error) {
    console.error('Error getting model list:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      models: []
    });
  }
});

/**
 * GET /api/models/:name
 * Get detailed information for a specific model
 */
router.get('/:name', async (req: Request, res: Response) => {
  try {
    const modelName = req.params.name;

    if (!modelName) {
      return res.status(400).json({
        success: false,
        error: 'Model name cannot be empty'
      });
    }

    // Check if Ollama service is available
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Ollama service is unavailable, please make sure Ollama is running'
      });
    }

    // Get all models and find the specified model
    const models = await getAvailableModels();
    const model = models.find((m: any) => m.name === modelName);

    if (!model) {
      return res.status(404).json({
        success: false,
        error: `Model not found: ${modelName}`
      });
    }

    return res.json({
      success: true,
      model: {
        name: model.name,
        size: model.size,
        modified_at: model.modified_at,
        digest: model.digest,
        details: model.details || {}
      }
    });

  } catch (error) {
    console.error('Error getting model details:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

export default router;
