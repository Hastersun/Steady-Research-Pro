import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendMessage, sendMessageStream, checkOllamaHealth } from '../lib/ollama.js';
import { OLLAMA_CONFIG } from '../lib/config.js';

const router = Router();

/**
 * POST /api/chat
 * 发送聊天消息（非流式）
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // 检查 Ollama 服务是否可用
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Ollama 服务不可用，请确保 Ollama 正在运行'
      });
    }

    const { message, model } = req.body;

    // 验证消息内容
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: '消息内容不能为空'
      });
    }

    // 使用指定模型或默认模型
    const selectedModel = model || OLLAMA_CONFIG.DEFAULT_MODEL;

    // 发送消息
    const result = await sendMessage(message, selectedModel);

    return res.status(result.success ? 200 : 500).json(result);

  } catch (error) {
    console.error('聊天 API 错误:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    });
  }
});

/**
 * POST /api/chat/stream
 * 发送聊天消息（流式响应）
 */
router.post('/stream', async (req: Request, res: Response) => {
  try {
    // 检查 Ollama 服务是否可用
    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Ollama 服务不可用，请确保 Ollama 正在运行'
      });
    }

    const { message, model } = req.body;

    // 验证消息内容
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: '消息内容不能为空'
      });
    }

    // 使用指定模型或默认模型
    const selectedModel = model || OLLAMA_CONFIG.DEFAULT_MODEL;

    // 设置流式响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 获取流式响应
    const stream = await sendMessageStream(message, selectedModel);

    // 发送流式数据
    for await (const part of stream) {
      if (part.message?.content) {
        res.write(`data: ${JSON.stringify({ content: part.message.content })}\n\n`);
      }
    }

    // 发送结束标记
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('流式聊天 API 错误:', error);
    
    // 如果还没有发送响应头，发送错误响应
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '服务器内部错误'
      });
    }
    
    // 如果已经开始流式传输，发送错误事件
    res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : '流式传输错误' })}\n\n`);
    res.end();
  }
});

export default router;
