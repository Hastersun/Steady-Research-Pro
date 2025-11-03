# 云端 LLM 提供商快速参考

## 🚀 5分钟快速开始

### 1. 添加 API Key
```bash
# 编辑 .env 文件
OPENAI_API_KEY=sk-your-key-here
```

### 2. 启动服务
```bash
npm run server:dev
```

### 3. 测试请求
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","provider":"openai"}'
```

## 📡 API 端点

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/chat` | POST | 发送消息（非流式） |
| `/api/chat/stream` | POST | 发送消息（流式） |
| `/api/chat/providers` | GET | 查询提供商状态 |

## 🎯 请求参数

```typescript
{
  message: string,      // 必需 - 用户消息
  provider?: string,    // 可选 - 'openai'|'anthropic'|'google'|'ollama'
  model?: string        // 可选 - 具体模型名称
}
```

## 🤖 支持的提供商

### OpenAI
```bash
provider: "openai"
models: ["gpt-4", "gpt-3.5-turbo"]
```

### Anthropic Claude
```bash
provider: "anthropic"
models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229"]
```

### Google Gemini
```bash
provider: "google"
models: ["gemini-pro", "gemini-ultra"]
```

### Ollama (本地)
```bash
provider: "ollama"
models: ["llama2", "mistral", "codellama"]
```

## 💻 代码示例

### JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello',
    provider: 'openai',
    model: 'gpt-3.5-turbo'
  })
});

const result = await response.json();
console.log(result.data);
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/chat', json={
    'message': 'Hello',
    'provider': 'openai',
    'model': 'gpt-3.5-turbo'
})

print(response.json()['data'])
```

### cURL
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","provider":"openai","model":"gpt-3.5-turbo"}'
```

## 🔄 流式响应

```typescript
const response = await fetch('http://localhost:3000/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Write a story',
    provider: 'openai'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));
  
  for (const line of lines) {
    const data = line.replace(/^data: /, '').trim();
    if (data === '[DONE]') break;
    
    try {
      const parsed = JSON.parse(data);
      process.stdout.write(parsed.content);
    } catch {}
  }
}
```

## 🔐 环境变量

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google
GOOGLE_API_KEY=AIzaSy...

# Ollama (本地)
OLLAMA_HOST=http://localhost:11434
```

## ⚠️ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `API key is missing` | 未配置 API Key | 在 `.env` 中添加相应的 API Key |
| `Service unavailable` | 服务不可用 | 检查 API Key 是否有效，网络是否畅通 |
| `Message cannot be empty` | 消息为空 | 确保 `message` 字段不为空 |
| `Invalid provider` | 提供商不存在 | 使用支持的提供商名称 |

## 📊 响应格式

### 成功
```json
{
  "success": true,
  "data": "AI 的响应内容...",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

### 失败
```json
{
  "success": false,
  "error": "错误描述",
  "model": "模型名称",
  "provider": "提供商名称"
}
```

## 🎨 模型选择指南

### 性能优先
- OpenAI: `gpt-4-turbo-preview`
- Anthropic: `claude-3-opus-20240229`
- Google: `gemini-ultra`

### 速度优先
- OpenAI: `gpt-3.5-turbo`
- Anthropic: `claude-3-haiku-20240307`
- Google: `gemini-pro`

### 成本优先
- OpenAI: `gpt-3.5-turbo`
- Ollama: 所有模型（免费）

### 隐私优先
- Ollama: 本地部署（完全隐私）

## 🔗 相关链接

- [完整文档](./CLOUD_LLM_INTEGRATION.md)
- [快速测试](../testing/CLOUD_LLM_QUICK_TEST.md)
- [集成总结](./CLOUD_LLM_INTEGRATION_SUMMARY.md)

## 📈 性能参考

| 提供商 | 平均延迟 | 吞吐量 | 成本 |
|--------|----------|--------|------|
| OpenAI GPT-3.5 | ~500ms | 高 | 低 |
| OpenAI GPT-4 | ~2s | 中 | 高 |
| Anthropic Claude | ~1s | 中 | 中 |
| Google Gemini | ~1s | 中 | 低 |
| Ollama | ~3s | 低 | 免费 |

## 💡 最佳实践

1. **开发阶段**: 使用本地 Ollama 或 GPT-3.5-turbo
2. **测试阶段**: 使用 Claude Haiku 或 Gemini Pro
3. **生产阶段**: 根据需求选择合适的模型
4. **成本控制**: 设置 `max_tokens` 限制
5. **错误处理**: 实现重试机制和降级策略

---

**提示**: 所有示例都假设服务器运行在 `http://localhost:3000`
