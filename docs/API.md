# API 文档

Steady Research Pro 提供了完整的 REST API 来进行深度研究、搜索和 AI 对话功能。

## 基础信息

- **基础URL**: `http://localhost:4321`（开发环境）
- **内容类型**: `application/json`
- **编码**: UTF-8

---

## 目录

1. [研究 API](#研究-api)
2. [搜索 API](#搜索-api)
3. [Ollama API](#ollama-api)
4. [HTTP LLM API](#http-llm-api)
5. [错误处理](#错误处理)

---

## 研究 API

### 1. 启动研究任务

启动一个新的研究任务，支持多步骤流水线处理。

**端点**: `POST /api/research`

**请求体**:

```json
{
  "query": "人工智能在医疗领域的应用",
  "model": "gpt-4",
  "options": {
    "searchEngines": ["bing", "google"],
    "maxResults": 10,
    "temperature": 0.3,
    "topP": 0.85,
    "providers": {
      "search": "openai",
      "modeling": "openai",
      "report": "openai"
    },
    "providerMapping": {
      "openai": {
        "baseUrl": "https://api.openai.com/v1",
        "apiKey": "your-api-key",
        "model": "gpt-4"
      }
    }
  }
}
```

**参数说明**:

- `query` (string, 必需): 研究主题或问题
- `model` (string, 可选): 默认使用的模型名称
- `options` (object, 可选): 研究配置选项
  - `searchEngines` (array): 搜索引擎列表，支持 `["bing", "google"]`
  - `maxResults` (number): 每个引擎的最大搜索结果数
  - `temperature` (number): AI 模型创造性参数 (0-1)
  - `topP` (number): AI 模型多样性参数 (0-1)
  - `providers` (object): 各步骤使用的提供商
  - `providerMapping` (object): 提供商配置映射

**响应**:

```json
{
  "success": true,
  "message": "研究任务已启动",
  "taskId": "1640995200000"
}
```

### 2. 流式研究任务

获取研究任务的实时进度和结果。

**端点**: `GET /api/research-stream`

**查询参数**:

- `query` (string, 必需): 研究主题
- `model` (string, 可选): 模型名称
- 其他参数同上

**响应**: Server-Sent Events (SSE) 流

**事件格式**:

```
event: progress
data: {"step": "search", "status": "running", "progress": 30, "message": "正在搜索相关信息..."}

event: result
data: {"step": "search", "results": [...], "metadata": {...}}

event: complete
data: {"success": true, "finalResult": {...}}

event: error
data: {"error": "错误信息", "code": "ERROR_CODE"}
```

---

## 搜索 API

### 1. 执行搜索

在多个搜索引擎中执行搜索查询。

**端点**: `POST /api/search`

**请求体**:

```json
{
  "query": "人工智能最新发展",
  "engines": ["bing", "google"],
  "options": {
    "maxResults": 5,
    "market": "zh-CN",
    "language": "zh"
  }
}
```

**参数说明**:

- `query` (string, 必需): 搜索查询
- `engines` (array, 必需): 搜索引擎列表
- `options` (object, 可选): 搜索选项
  - `maxResults` (number): 最大结果数
  - `market` (string): 市场/地区设置
  - `language` (string): 语言设置

**响应**:

```json
{
  "success": true,
  "results": [
    {
      "title": "文章标题",
      "url": "https://example.com/article",
      "snippet": "文章摘要...",
      "engine": "bing",
      "publishDate": "2024-01-01",
      "rank": 1
    }
  ],
  "metadata": {
    "totalResults": 150,
    "engines": ["bing", "google"],
    "queryTime": 1.2
  }
}
```

### 2. 配置搜索引擎

设置搜索引擎 API 密钥和配置。

**端点**: `POST /api/search` (带 `action: "configure"`)

**请求体**:

```json
{
  "action": "configure",
  "bingApiKey": "your-bing-api-key",
  "googleApiKey": "your-google-api-key",
  "googleCseId": "your-custom-search-engine-id"
}
```

**响应**:

```json
{
  "success": true,
  "message": "搜索引擎配置已更新",
  "availableEngines": {
    "bing": true,
    "google": true
  }
}
```

### 3. 测试搜索引擎

测试搜索引擎配置是否正确。

**端点**: `POST /api/search` (带 `action: "test"`)

**请求体**:

```json
{
  "action": "test",
  "query": "test",
  "engine": "bing"
}
```

---

## Ollama API

### 1. 获取模型列表

获取 Ollama 服务器上可用的模型列表。

**端点**: `GET /api/ollama?action=list`

**响应**:

```json
{
  "success": true,
  "models": [
    {
      "name": "llama2",
      "size": "3.8GB",
      "modified": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 2. 聊天对话

与 Ollama 模型进行对话。

**端点**: `POST /api/ollama`

**请求体**:

```json
{
  "action": "chat",
  "model": "llama2",
  "messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下人工智能"
    }
  ],
  "options": {
    "temperature": 0.7,
    "max_tokens": 1000
  }
}
```

**响应**:

```json
{
  "success": true,
  "response": {
    "message": {
      "role": "assistant",
      "content": "人工智能是..."
    },
    "model": "llama2",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### 3. 流式对话

实时获取 Ollama 模型的响应流。

**端点**: `GET /api/ollama-stream`

**查询参数**:

- `model` (string, 必需): 模型名称
- `prompt` (string, 必需): 用户输入
- `temperature` (number, 可选): 创造性参数

**响应**: Server-Sent Events 流

---

## HTTP LLM API

### 1. 聊天对话

与 HTTP API 兼容的 LLM 服务进行对话。

**端点**: `POST /api/http-api`

**请求体**:

```json
{
  "action": "chat",
  "provider": "openai",
  "model": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "解释量子计算的基本原理"
    }
  ],
  "options": {
    "temperature": 0.3,
    "max_tokens": 2000,
    "stream": false
  }
}
```

### 2. 流式对话

**端点**: `GET /api/http-api` (带 `stream=true`)

**查询参数**:

- `provider` (string, 必需): 提供商名称
- `model` (string, 必需): 模型名称
- `prompt` (string, 必需): 用户输入
- `stream` (boolean): 设置为 `true`

---

## 错误处理

### 错误响应格式

所有 API 错误都遵循统一的响应格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### 常见错误码

| 错误码                | HTTP状态码 | 描述             |
| --------------------- | ---------- | ---------------- |
| `INVALID_REQUEST`     | 400        | 请求参数无效     |
| `MISSING_API_KEY`     | 401        | 缺少 API 密钥    |
| `RATE_LIMITED`        | 429        | 请求频率过高     |
| `MODEL_NOT_FOUND`     | 404        | 指定模型不存在   |
| `SEARCH_ENGINE_ERROR` | 502        | 搜索引擎服务错误 |
| `LLM_SERVICE_ERROR`   | 502        | LLM 服务错误     |
| `INTERNAL_ERROR`      | 500        | 内部服务器错误   |

### 错误处理建议

1. **重试机制**: 对于 `5xx` 错误，建议使用指数退避重试
2. **限流处理**: 遇到 `429` 错误时，等待指定时间后重试
3. **验证输入**: 确保请求参数符合 API 规范
4. **监控日志**: 记录错误日志便于调试

---

## 使用示例

### JavaScript 示例

```javascript
// 启动研究任务
async function startResearch(query) {
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      options: {
        searchEngines: ['bing'],
        maxResults: 5,
        temperature: 0.3,
      },
    }),
  });

  const result = await response.json();
  return result;
}

// 流式获取研究进度
function streamResearch(query) {
  const eventSource = new EventSource(`/api/research-stream?query=${encodeURIComponent(query)}`);

  eventSource.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log('Progress:', data);
  };

  eventSource.onerror = error => {
    console.error('Stream error:', error);
  };
}
```

### cURL 示例

```bash
# 执行搜索
curl -X POST http://localhost:4321/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "人工智能发展趋势",
    "engines": ["bing"],
    "options": {
      "maxResults": 3
    }
  }'

# 获取 Ollama 模型列表
curl "http://localhost:4321/api/ollama?action=list"
```

---

## 版本信息

- **API 版本**: v1.0
- **最后更新**: 2024-01-01
- **兼容性**: 支持现代浏览器和 Node.js 环境

如有问题或建议，请参考项目文档或提交 Issue。
