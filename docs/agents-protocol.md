# 多代理研究工作流协议

> 版本：v0.2 · 适用于深度搜索代理里程碑（阶段 B）

## 总览

研究后端由统一的 `ResearchTaskProcessor` 调度，串联以下步骤：

| 步骤 ID       | Agent           | 职责                                 | 关键产出                    |
| ------------- | --------------- | ------------------------------------ | --------------------------- |
| `plan`        | 内置 Planner    | 整体研究目标与维度拆分               | `research_plan`（简要文本） |
| `deep_search` | `SearchAgent`   | 生成检索策略、调用搜索 API、整理证据 | 结构化 `search_notes`       |
| `modeling`    | `ModelingAgent` | 基于证据构建主题/因果模型            | 结构化 `model_blueprint`    |
| `reporting`   | `ReportAgent`   | 汇总模型与证据生成最终报告           | Markdown + 元数据           |

每个 Agent 均实现统一的 `run({ query, context, options, onToken })` 接口，返回 `{ content, metadata }`。

## 数据契约

### 1. `SearchAgent`

输入（`SearchAgentPayload`）：

```json
{
  "query": "string",
  "config": {
    "engines": ["bing", "google"],
    "maxResults": 20,
    "timeoutMs": 20000
  },
  "previous": {
    "plan": { "content": "..." }
  }
}
```

输出（`SearchAgentResult`）：

```json
{
  "strategy": {
    "primaryQuery": "string",
    "queries": ["string"],
    "engines": ["bing"],
    "notes": "生成策略原文"
  },
  "notes": [
    {
      "summary": "string",
      "evidence": [
        {
          "quote": "string",
          "source": "https://...",
          "confidence": 0.0
        }
      ],
      "topic": "string",
      "sourceUrl": "https://...",
      "engine": "bing"
    }
  ],
  "rawResults": [
    {
      "title": "string",
      "url": "https://...",
      "snippet": "string",
      "engine": "bing"
    }
  ],
  "metadata": {
    "durationMs": 0,
    "tokens": 0,
    "isFallback": false
  }
}
```

### 2. `ModelingAgent`

输入包含 `search.notes` 与 `search.strategy`：

```json
{
  "query": "string",
  "evidence": ["SearchAgentResult.notes"],
  "strategy": "SearchAgentResult.strategy",
  "options": {
    "targetModel": "string"
  }
}
```

输出（`ModelBlueprint`）：

```json
{
  "modelType": "causal_graph",
  "coreDrivers": [
    {
      "name": "string",
      "description": "string",
      "evidenceRefs": [0, 2]
    }
  ],
  "relationships": [
    { "from": "Driver A", "to": "Driver B", "type": "influence", "confidence": 0.7 }
  ],
  "scenarios": [
    {
      "name": "Optimistic",
      "assumptions": ["string"],
      "outcomes": ["string"],
      "confidence": 0.5
    }
  ],
  "metrics": [{ "name": "MarketShare", "estimate": 0.24, "unit": "%", "confidence": 0.6 }],
  "metadata": {
    "durationMs": 0,
    "tokens": 0,
    "warnings": []
  }
}
```

### 3. `ReportAgent`

输入：

```json
{
  "query": "string",
  "model": "ModelBlueprint",
  "evidence": "SearchAgentResult.notes",
  "options": {
    "format": "markdown",
    "audience": "executive"
  }
}
```

输出（`ResearchReport`）：

```json
{
  "markdown": "# 标题...",
  "outline": [{ "heading": "执行摘要", "bullets": ["string"] }],
  "sources": [{ "title": "string", "url": "https://...", "noteIndex": 3 }],
  "metadata": {
    "durationMs": 0,
    "tokens": 0,
    "streamed": true
  }
}
```

## SSE 消息格式

所有研究步骤沿用 `text/event-stream`，每条数据行 JSON 结构如下：

```json
{
  "stepId": "search",
  "stepType": "deep_search",
  "status": "start|progress|complete|error",
  "progress": 0.35,
  "label": "多源深度搜索",
  "payload": {
    "chunk": "增量文本，可选",
    "result": {
      /* 对应 Agent 输出 */
    },
    "metadata": {
      "tokens": 1024,
      "durationMs": 12650
    }
  }
}
```

约定：

- `stepId` 为兼容旧版 UI 的别名，`stepType` 表示真实的管线步骤；新前端可直接使用 `stepType`。
- `progress` 采用 0-1 浮点值，由 `ResearchTaskProcessor` 累计权重计算。
- 对于流式步骤（典型为 `reporting`），`payload.chunk` 将多次发送，最终一次必须携带 `payload.result`。
- 错误时 `status=error`，并携带 `payload.error`, `payload.result=null`。

## 全局配置对象

前端在 `window.steadyResearchConfig.deepAgent` 存储深度代理配置信息：

```json
{
  "enabled": true,
  "models": {
    "search": "llama3:8b",
    "modeling": "llama3:8b",
    "report": "llama3:70b"
  },
  "sampling": {
    "temperature": 0.3,
    "topP": 0.85
  }
}
```

该对象由 `SearchConfigPanel` 维护，当用户保存设置时，通过浏览器事件 `window.dispatchEvent(new CustomEvent('deepAgent:configChanged', { detail }))` 广播更新。

## 后续步骤

- 阶段 B：实现各个 Agent（`SearchAgent`, `ModelingAgent`, `ReportAgent`）。
- 阶段 C：更新前端时间线并消费上述 SSE payload。
- 阶段 D：扩展缓存、自动评估与监控。
