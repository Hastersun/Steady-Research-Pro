# 快速测试指南

## 🚀 Express 服务器已成功集成！

### 当前状态
✅ Express 服务器正在运行
✅ 所有路由已配置
✅ 文档已创建完成

### 立即测试

#### 1. 健康检查
```bash
curl http://localhost:3000/health
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2025-10-13T...",
  "uptime": 123.45
}
```

#### 2. 获取模型列表（需要 Ollama 运行）
```bash
curl http://localhost:3000/api/models
```

#### 3. 发送聊天消息（需要 Ollama 运行）
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"你好，介绍一下你自己\", \"model\": \"llama2\"}"
```

### 在浏览器中测试

直接在浏览器中打开：
- http://localhost:3000/health - 查看服务器状态
- http://localhost:3000/api/models - 查看可用模型

### 使用 PowerShell 测试

```powershell
# 健康检查
Invoke-RestMethod -Uri http://localhost:3000/health -Method Get

# 获取模型
Invoke-RestMethod -Uri http://localhost:3000/api/models -Method Get

# 发送消息
$body = @{
    message = "你好！"
    model = "llama2"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/chat -Method Post -Body $body -ContentType "application/json"
```

### 📁 已创建的文件

#### 核心文件
- ✅ `src/server.ts` - Express 主服务器
- ✅ `src/routes/chat.ts` - 聊天路由
- ✅ `src/routes/models.ts` - 模型管理路由
- ✅ `.env.example` - 环境变量模板

#### 文档文件
- ✅ `docs/guide/express-integration.md` - Express 集成指南
- ✅ `docs/api/express-api.md` - 完整 API 文档
- ✅ `EXPRESS_INTEGRATION_SUMMARY.md` - 集成总结
- ✅ `QUICK_TEST.md` - 本测试指南

#### 更新的文件
- ✅ `package.json` - 添加了 Express 脚本
- ✅ `README.md` - 更新了项目说明

### 📚 查看文档

- **集成指南**: [docs/guide/express-integration.md](docs/guide/express-integration.md)
- **API 文档**: [docs/api/express-api.md](docs/api/express-api.md)
- **集成总结**: [EXPRESS_INTEGRATION_SUMMARY.md](EXPRESS_INTEGRATION_SUMMARY.md)

### 🎯 下一步操作

1. **确保 Ollama 运行**
   ```bash
   ollama serve
   ```

2. **下载模型**（如果还没有）
   ```bash
   ollama pull llama2
   ```

3. **测试完整功能**
   - 启动 Express: `npm run server:dev`
   - 启动 Astro: `npm run dev`（在另一个终端）
   - 访问: http://localhost:4321

### 🔥 高级测试

#### JavaScript 客户端测试

创建一个测试文件 `test-client.js`:

```javascript
// test-client.js
async function testAPI() {
  const BASE_URL = 'http://localhost:3000';
  
  // 1. 健康检查
  console.log('1. 测试健康检查...');
  const health = await fetch(`${BASE_URL}/health`);
  console.log(await health.json());
  
  // 2. 获取模型列表
  console.log('\n2. 获取模型列表...');
  const models = await fetch(`${BASE_URL}/api/models`);
  console.log(await models.json());
  
  // 3. 发送消息
  console.log('\n3. 发送聊天消息...');
  const chat = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '你好，请简单介绍一下你自己',
      model: 'llama2'
    })
  });
  console.log(await chat.json());
}

testAPI().catch(console.error);
```

运行：
```bash
node test-client.js
```

### ✅ 验证清单

- [ ] Express 服务器在端口 3000 运行
- [ ] 健康检查返回 200 状态码
- [ ] 可以获取模型列表（如果 Ollama 运行）
- [ ] 可以发送聊天消息（如果 Ollama 运行）
- [ ] CORS 配置正确（前端可以访问）
- [ ] 文档可以正常查看

### 🆘 遇到问题？

查看故障排除文档：
- [docs/guide/troubleshooting.md](docs/guide/troubleshooting.md)
- [docs/guide/express-integration.md#常见问题](docs/guide/express-integration.md#常见问题)

---

**集成完成时间**: 2025-10-13
**版本**: 1.0.0
**状态**: ✅ 就绪
