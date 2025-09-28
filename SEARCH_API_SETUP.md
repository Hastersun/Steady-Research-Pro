# 搜索引擎 API 配置说明

本项目现在支持 Bing 和 Google 搜索 API 来进行真实的信息搜索。

## API 密钥配置

### 1. Bing Web Search API

1. 访问 [Azure Cognitive Services](https://portal.azure.com/)
2. 创建 "Bing Search v7" 资源
3. 获取 API 密钥

### 2. Google Custom Search API

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 启用 "Custom Search API"
3. 创建 API 密钥
4. 创建自定义搜索引擎：
   - 访问 [Custom Search Engine](https://cse.google.com/cse/)
   - 创建新的搜索引擎
   - 获取搜索引擎 ID (cx 参数)

## 使用方式

### 前端使用

```javascript
import searchApiClient from '../lib/search-api-client.js';

// 配置 API 密钥
await searchApiClient.setApiKeys({
  bing: 'your-bing-api-key',
  google: 'your-google-api-key',
  googleCseId: 'your-google-cse-id'
});

// 执行搜索
const result = await searchApiClient.search('人工智能发展趋势');
console.log(result);
```

### API 端点使用

```javascript
// POST /api/search
{
  "action": "search",
  "query": "人工智能发展趋势",
  "engines": ["bing", "google"],
  "apiKeys": {
    "bing": "your-bing-api-key",
    "google": "your-google-api-key",
    "googleCseId": "your-google-cse-id"
  }
}
```

### 研究处理器集成

```javascript
import ResearchTaskProcessor from '../lib/research-processor.js';

const processor = new ResearchTaskProcessor();

// 配置搜索 API
await processor.configureSearchAPIs({
  bing: 'your-bing-api-key',
  google: 'your-google-api-key',
  googleCseId: 'your-google-cse-id'
});

// 执行研究任务（现在会使用真实搜索）
const result = await processor.processResearchTask(
  '人工智能在教育领域的应用',
  'llama2',
  (step, status, progress, label, result) => {
    console.log(`${step}: ${status} - ${progress}% - ${label}`);
  }
);
```

## 支持的操作

### 1. 多引擎搜索
- `action: "search"`
- 同时使用 Bing 和 Google 搜索
- 自动去重和结果合并

### 2. 单引擎搜索
- `action: "bing-only"` - 仅使用 Bing
- `action: "google-only"` - 仅使用 Google

### 3. 查询生成
- `action: "generate-queries"`
- 为研究主题生成多个搜索查询变体

### 4. 智能研究搜索
- 使用前端客户端的 `researchSearch()` 方法
- 自动生成多个相关查询
- 汇总和去重结果

## 搜索选项

### Bing 选项
```javascript
{
  count: 10,        // 返回结果数量
  offset: 0,        // 偏移量
  market: 'zh-CN',  // 市场区域
  safeSearch: 'Moderate', // 安全搜索级别
}
```

### Google 选项
```javascript
{
  num: 10,          // 返回结果数量
  start: 1,         // 起始位置
  lr: 'lang_zh-CN', // 语言限制
  safe: 'medium',   // 安全搜索级别
  dateRestrict: 'm1' // 时间限制（可选）
}
```

## 注意事项

1. **API 限制**: 各搜索引擎都有请求频率限制
2. **成本**: Bing 和 Google API 都是付费服务
3. **错误处理**: 当 API 不可用时，系统会自动回退到模拟搜索
4. **结果质量**: 真实搜索结果的质量取决于查询的构建和 API 配置

## 免费配额

- **Bing**: 每月 1000 次免费查询
- **Google**: 每日 100 次免费查询

建议在开发和测试阶段使用模拟搜索，在生产环境中启用真实搜索 API。