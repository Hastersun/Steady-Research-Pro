# contextData.js 模块文档

## 简介
`contextData.js` 提供标准化上下文数据结构的创建与校验，具备极高鲁棒性，适用于复杂场景下的上下文管理。

## 导出方法

### createContextData(id, type, payload)
- 自动生成唯一ID（如未提供），深度克隆 payload，防止引用污染。
- 参数校验严格，type 必须为非空字符串，payload 必须为对象。
- 返回 `{ id, type, payload }`。

**示例：**
```js
const { createContextData } = require('./contextData');
const ctx = createContextData(undefined, 'dialog', { user: 'hi', bot: 'hello' });
```

### validateContextData(data)
- 深度校验 ContextData 结构和内容。
- 检查 id 格式（ctx_ 前缀）、type 非空、payload 为对象且无函数、无循环引用。
- 返回 `true` 或 `false`。

**示例：**
```js
const { validateContextData } = require('./contextData');
const valid = validateContextData(ctx); // true/false
```

### deepClone(obj)
- 工具函数，深度克隆对象，防止引用污染。

## 鲁棒性特性
- 自动唯一标识生成，防止冲突。
- 严格类型与内容校验，防止边界异常。
- 检查 payload 无函数属性、无循环引用。
- 支持多层嵌套安全校验。

## 推荐用法
- 用于对话、任务、配置等上下文的标准化存储与校验。
- 可结合 fileMemory.js 进行持久化。

---

如需更复杂场景支持，请扩展 validateContextData 校验逻辑。
