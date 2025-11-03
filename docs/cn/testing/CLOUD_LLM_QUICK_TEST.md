# 云端 LLM 提供商快速测试指南

## 测试准备

### 1. 配置环境变量

在 `.env` 文件中添加至少一个云端提供商的 API Key：

```bash
# 选择你想测试的提供商
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_API_KEY=AIzaSy...
```

### 2. 启动服务器

```bash
# Terminal 1: 启动 Express API 服务器
npm run server:dev

# Terminal 2 (可选): 启动 Astro 开发服务器
npm run dev
```

## 快速测试命令

### 测试 1: 检查所有提供商状态

```bash
curl http://localhost:3000/api/chat/providers
```

预期输出：显示所有提供商的可用性和支持的模型列表。

### 测试 2: OpenAI 非流式请求

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "用一句话介绍量子计算",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'
```

### 测试 3: OpenAI 流式请求

```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "写一个斐波那契数列的 Python 实现",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'
```

### 测试 4: Anthropic Claude 请求

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "解释什么是机器学习",
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229"
  }'
```

### 测试 5: Google Gemini 请求

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "什么是深度学习？",
    "provider": "google",
    "model": "gemini-pro"
  }'
```

### 测试 6: Ollama 本地请求（需要先启动 Ollama）

```bash
# 确保 Ollama 正在运行
ollama serve

# 测试请求
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "provider": "ollama",
    "model": "llama2"
  }'
```

## 使用 PowerShell 测试（Windows）

### 测试提供商状态

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat/providers" -Method Get | ConvertTo-Json -Depth 5
```

### OpenAI 测试

```powershell
$body = @{
    message = "介绍一下人工智能"
    provider = "openai"
    model = "gpt-3.5-turbo"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 5
```

### Anthropic 测试

```powershell
$body = @{
    message = "什么是神经网络？"
    provider = "anthropic"
    model = "claude-3-sonnet-20240229"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 5
```

## 使用 JavaScript 测试

创建测试文件 `test-llm.js`：

```javascript
const providers = [
  { name: 'openai', model: 'gpt-3.5-turbo' },
  { name: 'anthropic', model: 'claude-3-sonnet-20240229' },
  { name: 'google', model: 'gemini-pro' },
  { name: 'ollama', model: 'llama2' }
];

async function testProvider(provider, model) {
  console.log(`\n测试 ${provider} (${model})...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Hello from ${provider}! Please respond with your name.`,
        provider,
        model
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✓ ${provider} 成功!`);
      console.log(`响应: ${result.data.substring(0, 100)}...`);
    } else {
      console.log(`✗ ${provider} 失败: ${result.error}`);
    }
  } catch (error) {
    console.log(`✗ ${provider} 错误: ${error.message}`);
  }
}

async function runTests() {
  console.log('开始测试所有 LLM 提供商...\n');
  
  for (const { name, model } of providers) {
    await testProvider(name, model);
    // 等待 1 秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n测试完成!');
}

runTests();
```

运行测试：

```bash
node test-llm.js
```

## 预期结果

### 成功响应示例

```json
{
  "success": true,
  "data": "我是 GPT-3.5，由 OpenAI 开发的大型语言模型...",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

### 失败响应示例

```json
{
  "success": false,
  "error": "API key is missing for the selected provider",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

## 常见问题排查

### 1. 连接被拒绝

**问题**: `ECONNREFUSED` 错误

**解决方案**:
- 确保 Express 服务器正在运行：`npm run server:dev`
- 检查端口 3000 是否被占用

### 2. API Key 错误

**问题**: `API key is missing` 或 `Invalid API key`

**解决方案**:
- 检查 `.env` 文件中的 API Key 是否正确
- 确保环境变量已加载（重启服务器）
- 验证 API Key 格式是否正确

### 3. Ollama 不可用

**问题**: `ollama service is unavailable`

**解决方案**:
```bash
# 启动 Ollama
ollama serve

# 验证 Ollama 是否运行
curl http://localhost:11434/api/version

# 下载模型（如果需要）
ollama pull llama2
```

### 4. 超时错误

**问题**: 请求超时

**解决方案**:
- 检查网络连接
- 对于云端提供商，验证网络可以访问外部 API
- 增加超时设置（在 `src/lib/config.ts` 中）

## 性能基准测试

### 响应时间测试

```bash
# 使用 time 命令测试响应时间
time curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"测试","provider":"openai","model":"gpt-3.5-turbo"}'
```

### 并发测试

```bash
# 使用 Apache Bench (ab) 进行并发测试
ab -n 100 -c 10 -p request.json -T application/json http://localhost:3000/api/chat
```

其中 `request.json` 包含：

```json
{"message":"测试消息","provider":"openai","model":"gpt-3.5-turbo"}
```

## 下一步

1. **集成到前端**: 参考 `docs/cn/integration/CLOUD_LLM_INTEGRATION.md` 中的 React 示例
2. **添加用户界面**: 更新 Dashboard 组件以支持提供商选择
3. **实现缓存**: 添加响应缓存以减少 API 调用
4. **监控和日志**: 实现请求日志和错误监控

## 相关文档

- [云端 LLM 集成完整指南](./CLOUD_LLM_INTEGRATION.md)
- [Express 集成摘要](./EXPRESS_INTEGRATION_SUMMARY.md)
- [API 参考文档](../../api/express-api.md)
