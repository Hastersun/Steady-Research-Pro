# 云端 LLM 提供商集成指南

## 概述

本项目现已支持多个云端和本地 LLM 提供商，包括：

- **OpenAI** (GPT-4, GPT-3.5-turbo 等)
- **Anthropic Claude** (Claude 3 Opus, Sonnet, Haiku 等)
- **Google Gemini** (Gemini Pro, Ultra 等)
- **Ollama** (本地部署)
- **OpenLLM** (本地部署，兼容 OpenAI API)

## 快速开始

### 1. 配置环境变量

复制 `.env.example` 到 `.env` 并填写你需要的 API Keys：

```bash
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Ollama (本地)
OLLAMA_HOST=http://localhost:11434
```

### 2. API 使用方法

#### 非流式请求

```bash
# 使用 OpenAI
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好，请介绍一下你自己",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'

# 使用 Anthropic Claude
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "解释量子计算的基本原理",
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229"
  }'

# 使用 Google Gemini
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "写一个快速排序的 Python 实现",
    "provider": "google",
    "model": "gemini-pro"
  }'

# 使用 Ollama (默认)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好",
    "provider": "ollama",
    "model": "llama2"
  }'
```

#### 流式请求 (Server-Sent Events)

```bash
# 流式响应示例
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "写一个关于太空探索的短文",
    "provider": "openai",
    "model": "gpt-4"
  }'
```

#### 查询可用的提供商

```bash
# 获取所有提供商的状态和可用模型
curl http://localhost:3000/api/chat/providers
```

响应示例：

```json
{
  "success": true,
  "providers": [
    {
      "name": "openai",
      "available": true,
      "models": ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"]
    },
    {
      "name": "anthropic",
      "available": true,
      "models": ["claude-3-opus-20240229", "claude-3-sonnet-20240229"]
    },
    {
      "name": "google",
      "available": false,
      "models": []
    },
    {
      "name": "ollama",
      "available": true,
      "models": ["llama2", "codellama", "mistral"]
    }
  ],
  "default": "ollama"
}
```

### 3. JavaScript/TypeScript 客户端示例

```typescript
// 非流式请求
async function sendMessage(message: string, provider: string = 'openai', model?: string) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      provider,
      model
    })
  });
  
  const result = await response.json();
  console.log(result.data);
  return result;
}

// 流式请求
async function sendStreamingMessage(message: string, provider: string = 'openai', model?: string) {
  const response = await fetch('http://localhost:3000/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      provider,
      model
    })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

    for (const line of lines) {
      const data = line.replace(/^data: /, '').trim();
      if (data === '[DONE]') {
        console.log('Stream completed');
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (parsed.content) {
          process.stdout.write(parsed.content); // 逐字输出
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}

// 使用示例
await sendMessage('你好，介绍一下你自己', 'openai', 'gpt-3.5-turbo');
await sendStreamingMessage('写一个斐波那契数列的实现', 'anthropic', 'claude-3-sonnet-20240229');
```

### 4. React 组件集成示例

```tsx
import { useState } from 'react';

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [provider, setProvider] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          provider
        })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data: /, '').trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              setResponse(prev => prev + parsed.content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic Claude</option>
          <option value="google">Google Gemini</option>
          <option value="ollama">Ollama (本地)</option>
        </select>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入你的消息..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
      <div>{response}</div>
    </div>
  );
}
```

## 支持的模型

### OpenAI
- `gpt-4-turbo-preview` - 最新的 GPT-4 Turbo 模型
- `gpt-4` - GPT-4 基础模型
- `gpt-3.5-turbo` - 快速且经济的模型
- `gpt-3.5-turbo-16k` - 16K 上下文窗口版本

### Anthropic Claude
- `claude-3-opus-20240229` - 最强大的 Claude 3 模型
- `claude-3-sonnet-20240229` - 平衡性能和速度
- `claude-3-haiku-20240307` - 最快的 Claude 3 模型
- `claude-2.1` - Claude 2.1 版本
- `claude-2.0` - Claude 2.0 版本

### Google Gemini
- `gemini-pro` - 标准 Gemini 模型
- `gemini-pro-vision` - 支持图像输入
- `gemini-ultra` - 最强大的 Gemini 模型

### Ollama (本地)
- `llama2` - Meta 的开源 LLM
- `codellama` - 专门用于代码生成
- `mistral` - Mistral AI 的开源模型
- 更多模型请查看 [Ollama 库](https://ollama.ai/library)

## 配置参数

### 请求参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `message` | string | 是 | - | 用户消息内容 |
| `provider` | string | 否 | `ollama` | LLM 提供商 (`openai`, `anthropic`, `google`, `ollama`, `openllm`) |
| `model` | string | 否 | 提供商默认模型 | 使用的具体模型 |

### 响应格式

#### 非流式响应

```json
{
  "success": true,
  "data": "AI 的响应内容...",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

#### 流式响应 (Server-Sent Events)

```
data: {"content": "Hello"}

data: {"content": " world"}

data: {"content": "!"}

data: [DONE]
```

## 错误处理

所有 API 在出错时返回以下格式：

```json
{
  "success": false,
  "error": "错误信息描述",
  "model": "使用的模型",
  "provider": "使用的提供商"
}
```

常见错误：

- `API key is missing for the selected provider` - 缺少 API Key
- `{provider} service is unavailable` - 服务不可用
- `Message content cannot be empty` - 消息内容为空
- `Invalid provider` - 不支持的提供商

## 最佳实践

1. **API Key 安全**
   - 永远不要在客户端代码中暴露 API Keys
   - 使用环境变量存储敏感信息
   - 在生产环境中使用适当的访问控制

2. **成本控制**
   - 云端提供商按 token 计费，注意使用量
   - 对于开发测试，考虑使用本地 Ollama
   - 设置合理的 `max_tokens` 限制

3. **性能优化**
   - 流式响应提供更好的用户体验
   - 根据使用场景选择合适的模型
   - 使用缓存减少重复请求

4. **错误处理**
   - 始终处理 API 错误
   - 实现重试机制
   - 提供降级方案（如从 GPT-4 降级到 GPT-3.5）

## 故障排除

### OpenAI 连接失败
- 检查 API Key 是否正确
- 确认账户有足够的余额
- 检查网络连接和防火墙设置

### Anthropic 连接失败
- 验证 API Key 格式（应以 `sk-ant-` 开头）
- 检查账户状态和配额

### Google Gemini 连接失败
- 确认 API Key 已启用 Gemini API
- 检查地区限制

### Ollama 连接失败
- 确保 Ollama 服务正在运行：`ollama serve`
- 验证端口 11434 没有被占用
- 检查模型是否已下载：`ollama list`

## 进阶配置

### 自定义生成参数

在 `src/lib/config.ts` 中可以调整每个提供商的默认参数：

```typescript
export const OPENAI_CONFIG = {
  // ...
  GENERATION_CONFIG: {
    temperature: 0.7,    // 创造性 (0-2)
    max_tokens: 2048,    // 最大输出长度
    top_p: 1,            // 核采样
    frequency_penalty: 0, // 频率惩罚
    presence_penalty: 0,  // 存在惩罚
  },
};
```

### 添加新的提供商

1. 在 `src/lib/config.ts` 中添加配置
2. 在 `src/lib/llm-providers.ts` 中实现 `ILLMProvider` 接口
3. 在 `createLLMProvider` 工厂函数中注册

## 许可和限制

- OpenAI: 按 token 计费，查看 [定价](https://openai.com/pricing)
- Anthropic: 按 token 计费，查看 [定价](https://www.anthropic.com/pricing)
- Google Gemini: 有免费额度，查看 [定价](https://ai.google.dev/pricing)
- Ollama: 完全免费，本地运行

## 相关资源

- [OpenAI API 文档](https://platform.openai.com/docs)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [Google Gemini API 文档](https://ai.google.dev/docs)
- [Ollama 文档](https://ollama.ai/docs)
