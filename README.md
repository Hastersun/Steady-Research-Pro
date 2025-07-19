# intelliGuard

Context Engineering Framework

## 项目简介

intelliGuard 是一个用于上下文工程的基础框架，支持文件型存储、标准化 JSON 数据结构、依赖注入等能力，便于集成外部服务（如 LLM）。

## 项目结构
详见 [structure.md](./structure.md)

## 快速开始

1. 安装依赖：
   ```bash
   npm install
   ```
2. 运行测试：
   ```bash
   npm test
   ```
3. 按需引入各模块进行开发。

## 基础示例

### 单轮对话上下文管理
```js
const { createContextData, validateContextData } = require('./src/contextData');
const { writeContext, readContext } = require('./src/fileMemory');

// 创建上下文数据
const ctx = createContextData('1', 'dialog', { user: '你好', bot: '您好！' });
if (validateContextData(ctx)) {
  writeContext('context.json', ctx); // 保存到文件
  const loaded = readContext('context.json'); // 读取文件
  console.log(loaded);
}
```

### 简单依赖注入场景
```js
const { Container } = require('./src/di');

const container = new Container();
// 注册本地服务
container.register('logger', console);
// 动态注入外部服务（如 LLM）
container.inject('llm', async () => ({ chat: (msg) => '模拟回复: ' + msg })).then(llm => {
  console.log(llm.chat('你好')); // 输出：模拟回复: 你好
});
```

---

如需扩展功能或集成实际 LLM 服务，请参考各模块源码。
