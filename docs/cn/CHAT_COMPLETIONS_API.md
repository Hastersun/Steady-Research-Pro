# Chat Completions API

## OpenAI 兼容的 Chat Completions API

这个 API 端点提供与 OpenAI Chat Completions API 兼容的接口，可以无缝替换 OpenAI API。

## 端点

```
POST /api/v1/chat/completions
```

## 请求格式

### Headers
```
Content-Type: application/json
```

### Body 参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `messages` | array | 是 | - | 消息列表 |
| `model` | string | 否 | llama2 | 使用的模型名称 |
| `temperature` | number | 否 | 0.7 | 控制随机性 (0-2) |
| `max_tokens` | number | 否 | - | 最大生成token数 |
| `stream` | boolean | 否 | false | 是否流式返回（暂不支持） |
| `top_p` | number | 否 | - | 核采样参数 |
| `n` | number | 否 | 1 | 生成响应数量 |
| `user` | string | 否 | - | 用户标识 |

### Messages 格式

```typescript
{
  "messages": [
    {
      "role": "system" | "user" | "assistant",
      "content": string
    }
  ]
}
```

## 响应格式

### 成功响应 (200)

```json
{
  "id": "chatcmpl-1699234567890",
  "object": "chat.completion",
  "created": 1699234567,
  "model": "llama2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "AI 的响应内容"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": -1,
    "completion_tokens": -1,
    "total_tokens": -1
  }
}
```

### 错误响应

```json
{
  "error": {
    "message": "错误描述",
    "type": "错误类型",
    "code": "错误代码"
  }
}
```

#### 错误类型

- `service_unavailable` (503) - Ollama 服务不可用
- `invalid_request_error` (400) - 请求参数错误
- `not_implemented` (501) - 功能未实现
- `api_error` (500) - API 错误
- `internal_error` (500) - 内部服务器错误

## 使用示例

### cURL

```bash
curl -X POST http://localhost:4321/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system",
        "content": "你是一个有帮助的AI助手。"
      },
      {
        "role": "user",
        "content": "什么是人工智能？"
      }
    ],
    "model": "llama2",
    "temperature": 0.7
  }'
```

### JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:4321/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      {
        role: 'system',
        content: '你是一个有帮助的AI助手。'
      },
      {
        role: 'user',
        content: '什么是人工智能？'
      }
    ],
    model: 'llama2',
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:4321/api/v1/chat/completions',
    json={
        'messages': [
            {
                'role': 'system',
                'content': '你是一个有帮助的AI助手。'
            },
            {
                'role': 'user',
                'content': '什么是人工智能？'
            }
        ],
        'model': 'llama2',
        'temperature': 0.7
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

### 使用 OpenAI SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'not-needed', // Ollama 不需要 API key
  baseURL: 'http://localhost:4321/api/v1'
});

const completion = await openai.chat.completions.create({
  messages: [
    {
      role: 'system',
      content: '你是一个有帮助的AI助手。'
    },
    {
      role: 'user',
      content: '什么是人工智能？'
    }
  ],
  model: 'llama2',
  temperature: 0.7
});

console.log(completion.choices[0].message.content);
```

## 与 OpenAI API 的兼容性

### 支持的功能
- ✅ 标准消息格式 (system/user/assistant)
- ✅ 模型选择
- ✅ Temperature 参数
- ✅ 错误处理
- ✅ CORS 支持

### 暂不支持的功能
- ❌ 流式响应 (stream)
- ❌ Token 计数 (usage 字段返回 -1)
- ❌ 多个响应 (n > 1)
- ❌ Function calling
- ❌ 停止序列 (stop)

### 差异说明

1. **Token 计数**: Ollama 不提供 token 计数，`usage` 字段的所有值都是 -1
2. **流式响应**: 当前版本不支持流式响应，使用 `/api/chat/stream` 代替
3. **模型名称**: 使用 Ollama 支持的模型名称 (如 llama2, mistral, codellama)

## 配置

### 环境变量

```bash
# .env
OLLAMA_HOST=http://localhost:11434
```

### 支持的模型

取决于您在 Ollama 中安装的模型：
- llama2
- llama3
- mistral
- codellama
- phi
- 其他 Ollama 支持的模型

查看可用模型：
```bash
ollama list
```

## 错误处理

### 常见错误

#### 1. Ollama 服务不可用
```json
{
  "error": {
    "message": "Ollama service is unavailable. Please make sure Ollama is running.",
    "type": "service_unavailable",
    "code": "ollama_unavailable"
  }
}
```

**解决方案**: 启动 Ollama 服务
```bash
ollama serve
```

#### 2. 消息格式错误
```json
{
  "error": {
    "message": "Messages must be a non-empty array",
    "type": "invalid_request_error",
    "code": "invalid_messages"
  }
}
```

**解决方案**: 确保 `messages` 是非空数组，且每个消息都有 `role` 和 `content` 字段

#### 3. 模型不存在
```json
{
  "error": {
    "message": "Failed to generate response",
    "type": "api_error",
    "code": "generation_failed"
  }
}
```

**解决方案**: 确认模型已安装
```bash
ollama pull llama2
```

## 性能优化

### 建议
1. 使用较小的模型以获得更快的响应
2. 调整 `temperature` 和 `max_tokens` 以平衡质量和速度
3. 考虑实现缓存机制
4. 对于生产环境，使用专用的 GPU 服务器

### 基准测试

| 模型 | 平均响应时间 | 内存使用 |
|------|------------|---------|
| llama2 | ~2-5s | ~4GB |
| mistral | ~1-3s | ~4GB |
| phi | ~1-2s | ~2GB |

*实际性能取决于硬件配置*

## 安全性

### CORS
API 默认允许所有来源 (`Access-Control-Allow-Origin: *`)。生产环境中应限制为特定域名。

### 速率限制
当前版本未实现速率限制。生产环境中建议添加。

### 认证
当前版本不需要认证。如需添加，可在请求中检查 `Authorization` header。

## 后续开发

计划添加的功能：
- [ ] 流式响应支持
- [ ] Token 计数
- [ ] Function calling
- [ ] 速率限制
- [ ] API 密钥认证
- [ ] 请求日志和监控
- [ ] 缓存机制
- [ ] 多模型并行请求

## 相关文档

- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [本项目 API 文档](../../../EXPRESS_INTEGRATION_SUMMARY.md)
