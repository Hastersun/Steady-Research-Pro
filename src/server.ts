import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import modelsRouter from './routes/models.js';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app: Express = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 健康检查端点
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/api/chat', chatRouter);
app.use('/api/models', modelsRouter);

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: '请求的资源不存在'
  });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    error: err.message || '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Express 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 API 文档: http://localhost:${PORT}/api`);
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`);
});

export default app;
