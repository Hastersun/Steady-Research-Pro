# 项目结构说明

```
intelliGuard/
├── src/
│   ├── index.js           # 入口文件
│   ├── fileMemory.js      # 文件型上下文存储
│   ├── contextData.js     # 标准化 JSON 数据结构
│   ├── di.js              # 依赖注入框架
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   └── tasks.json
├── package.json
├── README.md
└── structure.md           # 项目结构说明
```

## 主要模块
- **fileMemory.js**：文件/URL 读写 JSON 上下文
- **contextData.js**：标准化上下文数据结构及校验
- **di.js**：依赖注入容器，支持外部服务动态注入

---

# 入门指南

1. 安装依赖：
   ```
   npm install
   ```
2. 运行示例或测试：
   ```
   npm test
   ```
3. 按需引入各模块进行开发。
