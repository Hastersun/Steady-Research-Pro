# intelliGuard API 文档

## 概述
intelliGuard 提供上下文工程基础能力，包括文件/URL存储、标准化数据结构、依赖注入等。各模块均可独立或组合使用。

---

## src/contextData.js
- `createContextData(id, type, payload)`
  - 创建标准化上下文数据，自动生成唯一ID，深度克隆payload。
- `validateContextData(data)`
  - 深度校验数据结构、类型、内容。
- `deepClone(obj)`
  - 工具函数，深度克隆对象。

---

## src/fileMemory.js
- `readContext(filePath)`
  - 同步读取本地 JSON 文件，返回对象或 null。
- `writeContext(filePath, context)`
  - 同步写入对象到本地 JSON 文件。
- `readContextFromUrl(url)`
  - 异步读取远程 URL 的 JSON 数据，返回 Promise<object|null>。

---

## src/di.js
- `Container`
  - 依赖注入容器类。
  - `register(name, instance)`：注册服务。
  - `get(name)`：获取服务。
  - `inject(name, factory)`：异步动态注入外部服务（如 LLM）。

---

## 示例

### 单轮对话上下文管理
```js
const { createContextData, validateContextData } = require('../src/contextData');
const { writeContext, readContext } = require('../src/fileMemory');
// 创建上下文数据
const ctx = createContextData(undefined, 'dialog', { user: '你好', bot: '您好！' });
if (validateContextData(ctx)) {
  writeContext('context.json', ctx); // 保存到文件
  const loaded = readContext('context.json'); // 读取文件
  console.log(loaded);
}
```

### 简单依赖注入场景
```js
const { Container } = require('../src/di');

const container = new Container();
// 注册本地服务
container.register('logger', console);
// 动态注入外部服务（如 LLM）
container.inject('llm', async () => ({ chat: (msg) => '模拟回复: ' + msg })).then(llm => {
  console.log(llm.chat('你好')); // 输出：模拟回复: 你好
});
```

### 远程上下文读取
```js
const { readContextFromUrl } = require('../src/fileMemory');
readContextFromUrl('https://example.com/context.json').then(ctx => {
  console.log(ctx);
});
```

---

## 推荐组合
- 上下文数据标准化 + 文件/URL存储 + 依赖注入，适用于对话、任务、配置等场景。

如需扩展，请参考各模块源码及注释。
