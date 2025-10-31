import { Router } from 'express';
import type { Request, Response } from 'express';
import { getAvailableModels, checkOllamaHealth } from '../lib/ollama.js';

const router = Router();

/**
 * GET /api/models
 * 获取可用的模型列表
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // 检查 Ollama 服务是否可用
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Ollama 服务不可用，请确保 Ollama 正在运行',
        models: []
      });
    }

    // 获取模型列表
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
    console.error('获取模型列表错误:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误',
      models: []
    });
  }
});

/**
 * GET /api/models/:name
 * 获取特定模型的详细信息
 */
router.get('/:name', async (req: Request, res: Response) => {
  try {
    const modelName = req.params.name;

    if (!modelName) {
      return res.status(400).json({
        success: false,
        error: '模型名称不能为空'
      });
    }

    // 检查 Ollama 服务是否可用
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Ollama 服务不可用，请确保 Ollama 正在运行'
      });
    }

    // 获取所有模型并查找指定模型
    const models = await getAvailableModels();
    const model = models.find((m: any) => m.name === modelName);

    if (!model) {
      return res.status(404).json({
        success: false,
        error: `未找到模型: ${modelName}`
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
    console.error('获取模型详情错误:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    });
  }
});

export default router;
