# 🚀 Astro + Tailwind CSS + Ollama AI

<div align="center">

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)

一个现代化的 AI 聊天 Web 应用程序，集成了 Astro.js、Tailwind CSS 和 Ollama AI

[在线演示](http://localhost:4321) • [快速开始](#-快速开始) • [文档](#-项目结构)

</div>

## ✨ 功能特性

- 🚀 **Astro.js** - 现代静态网站生成器，零 JavaScript 运行时
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架，快速构建现代 UI
- 🤖 **Ollama AI** - 本地 AI 模型集成，支持多种开源大语言模型
- � **OpenLLM** - 生产级 LLM 部署平台，兼容 OpenAI API
- �💬 **实时聊天** - 流畅的 AI 对话体验，支持多模型切换
- 🔄 **Express.js API** - 独立的 RESTful API 服务器，支持流式响应
- 📱 **响应式设计** - 完美适配桌面端和移动端设备
- ⚡ **快速开发** - 热重载开发体验，毫秒级构建速度
- 🛡️ **类型安全** - 完整的 TypeScript 支持
- 🎯 **零配置** - 开箱即用的开发环境
- 🔒 **隐私优先** - 所有数据处理都在本地进行

## 🚀 快速开始

### 前提条件

- Node.js 18+ 
- npm 或 yarn
- [Ollama](https://ollama.ai/) (用于本地 AI 模型)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd templ
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **安装并启动 Ollama**
   ```bash
   # 下载并安装 Ollama (访问 https://ollama.ai)
   # 启动 Ollama 服务
   ollama serve
   
   # 在新终端中下载模型
   ollama pull llama2
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **打开浏览器**
   
   访问 [http://localhost:4321](http://localhost:4321) 开始使用！

## 📁 项目结构

```
📦 templ/
├── 📂 public/                     # 静态资源
│   └── favicon.svg
├── 📂 src/
│   ├── 📂 components/             # Astro 组件
│   │   └── Chat.astro            # 聊天界面组件
│   ├── 📂 lib/                   # 工具库
│   │   ├── config.ts             # 应用配置
│   │   └── ollama.ts             # Ollama API 封装
│   ├── 📂 routes/                # Express 路由
│   │   ├── chat.ts              # 聊天路由
│   │   └── models.ts            # 模型管理路由
│   ├── 📂 pages/                 # Astro 页面路由
│   │   ├── 📂 api/               # Astro API 端点
│   │   │   ├── chat.ts           # 聊天 API
│   │   │   └── models.ts         # 模型列表 API
│   │   ├── index.astro           # 首页
│   │   └── chat.astro            # 聊天页面
│   └── server.ts                 # Express 服务器
├── 📂 docs/                      # 项目文档
│   ├── 📂 guide/                 # 使用指南
│   │   ├── express-integration.md # Express 集成指南
│   │   └── ...
│   └── 📂 api/                   # API 文档
│       ├── express-api.md        # Express API 文档
│       └── ...
├── .env.example                  # 环境变量示例
├── astro.config.mjs              # Astro 配置
├── tailwind.config.mjs           # Tailwind 配置
└── package.json                  # 项目依赖
```

## 🎯 使用说明

### 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动 Astro 开发服务器 (http://localhost:4321) |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run preview` | 预览构建后的网站 |
| `npm run server` | 启动 Express API 服务器 (http://localhost:3000) |
| `npm run server:dev` | 启动 Express 开发模式（自动重启） |
| `npm run server:watch` | 启动 Express 监听模式（文件变化自动重启） |

### 双服务器架构

本项目支持两种运行模式：

#### 1. 仅 Astro（使用 Astro API 路由）
```bash
npm run dev
```
访问 http://localhost:4321

#### 2. Astro + Express（推荐）
在两个终端窗口中分别运行：

**终端 1 - Astro 前端:**
```bash
npm run dev
```

**终端 2 - Express 后端:**
```bash
npm run server:dev
```

然后访问：
- **Astro 前端**: http://localhost:4321
- **Express API**: http://localhost:3000
- **健康检查**: http://localhost:3000/health

### 环境配置

复制 `.env.example` 到 `.env` 并配置：

```env
# Express 服务器端口
PORT=3000

# CORS 配置
CORS_ORIGIN=http://localhost:4321

# Ollama 服务地址
OLLAMA_HOST=http://localhost:11434
```

### 功能使用

1. **访问首页** - 查看项目介绍和功能概览
2. **进入聊天** - 点击"开始 AI 聊天"按钮或访问 `/chat`
3. **选择模型** - 在聊天界面顶部选择不同的 AI 模型
4. **开始对话** - 输入消息并按回车或点击发送按钮

### 支持的 AI 模型

项目支持所有通过 Ollama 安装的模型：

| 模型 | 大小 | 特点 | 下载命令 |
|------|------|------|----------|
| **llama2** | 3.8GB | 通用对话模型 | `ollama pull llama2` |
| **codellama** | 3.8GB | 代码生成专家 | `ollama pull codellama` |
| **mistral** | 4.1GB | 高效多语言模型 | `ollama pull mistral` |
| **neural-chat** | 4.1GB | 对话优化模型 | `ollama pull neural-chat` |
| **starling-lm** | 4.1GB | 指令跟随模型 | `ollama pull starling-lm` |

> 💡 **提示**: 首次使用需要下载模型，建议从 `llama2` 开始

## 📡 API 接口

### Astro API 路由 (端口 4321)

这些端点集成在 Astro 应用中，适合简单的 SSR 场景。

#### `GET /api/models`
获取可用的 Ollama 模型列表

#### `POST /api/chat`
发送消息到 AI 模型进行对话

### Express API 服务器 (端口 3000)

独立的 RESTful API 服务器，提供更强大的功能和流式响应支持。

#### `GET /health`
健康检查端点

**响应:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-13T12:00:00.000Z",
  "uptime": 3600.5
}
```

#### `GET /api/models`
获取可用的 Ollama 模型列表

**响应示例:**
```json
{
  "success": true,
  "models": [
    {
      "name": "llama2:latest",
      "size": 3826793677,
      "digest": "sha256:...",
      "modified_at": "2024-01-15T12:00:00Z"
    }
  ],
  "count": 1
}
```

#### `POST /api/chat`
发送消息到 AI 模型进行对话（非流式）

**请求体:**
```json
{
  "message": "解释一下什么是 Astro.js",
  "model": "llama2"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": "Astro.js 是一个现代的静态网站生成器，它采用岛屿架构（Islands Architecture）...",
  "model": "llama2"
}
```

**错误响应:**
```json
{
  "success": false,
  "error": "消息内容不能为空"
}
```

#### `POST /api/chat/stream`
发送消息到 AI 模型进行对话（流式响应）

**请求体:**
```json
{
  "message": "写一首关于春天的诗",
  "model": "llama2"
}
```

**响应格式:** Server-Sent Events (SSE)

```
data: {"content":"春"}
data: {"content":"天"}
data: {"content":"来"}
data: {"content":"了"}
data: [DONE]
```

📚 **完整 API 文档**: 查看 [Express API 文档](docs/api/express-api.md) 了解更多详情
  "success": false,
  "error": "Ollama 服务不可用，请确保 Ollama 正在运行"
}
```

## ⚙️ 配置说明

### Ollama 配置

在 `src/lib/config.ts` 中自定义 Ollama 设置：

```typescript
export const OLLAMA_CONFIG = {
  HOST: 'http://localhost:11434',     // Ollama 服务器地址
  DEFAULT_MODEL: 'llama2',            // 默认模型
  REQUEST_TIMEOUT: 30000,             // 请求超时 (30秒)
  
  // 支持的模型列表
  FALLBACK_MODELS: [
    'llama2', 'codellama', 'mistral', 
    'neural-chat', 'starling-lm'
  ],
  
  // API 端点配置
  ENDPOINTS: {
    HEALTH: '/api/version',
    MODELS: '/api/tags', 
    CHAT: '/api/chat'
  }
};
```

### 环境变量

创建 `.env.local` 文件进行个性化配置：

```env
# Ollama 服务器地址 (可选)
OLLAMA_HOST=http://localhost:11434

# 默认模型 (可选) 
DEFAULT_MODEL=llama2

# 请求超时时间 (可选)
REQUEST_TIMEOUT=30000
```

### Tailwind CSS 自定义

在 `tailwind.config.mjs` 中修改样式主题：

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // 自定义主色调
        secondary: '#10B981',   // 自定义辅助色
      }
    },
  },
  plugins: [],
}
```

## 🔧 故障排除

<details>
<summary><strong>❌ Ollama 服务连接失败</strong></summary>

**症状**: 聊天界面显示"连接失败"，无法获取模型列表

**解决方案**:
1. 检查 Ollama 服务状态
   ```bash
   ollama serve
   ```

2. 验证服务端口 (默认 11434)
   ```bash
   curl http://localhost:11434/api/version
   ```

3. 检查防火墙设置，确保端口可访问

4. 确认模型已下载
   ```bash
   ollama list
   ```

</details>

<details>
<summary><strong>🐌 模型响应缓慢</strong></summary>

**可能原因和解决方案**:

- **内存不足**: 确保系统有足够内存 (推荐 8GB+)
- **模型太大**: 尝试较小模型 (`llama2:7b` vs `llama2:70b`)  
- **CPU 负载**: 关闭其他占用 CPU 的程序
- **磁盘 I/O**: 确保模型存储在 SSD 上

**性能优化建议**:
```bash
# 使用量化模型 (更小但性能相近)
ollama pull llama2:7b-q4_0

# 设置并发数限制
export OLLAMA_NUM_PARALLEL=1
```

</details>

<details>
<summary><strong>🚫 构建错误</strong></summary>

**常见问题**:

1. **Node.js 版本**: 确保使用 Node.js 18+
2. **依赖冲突**: 删除 `node_modules` 和 `package-lock.json` 重新安装
3. **TypeScript 错误**: 运行 `npm run astro check` 检查类型

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 应该 >= 18.0.0
```

</details>

<details>
<summary><strong>🌐 端口占用</strong></summary>

如果默认端口 4321 被占用:

```bash
# 使用其他端口启动
npm run dev -- --port 3000

# 或者修改 astro.config.mjs
export default defineConfig({
  server: { port: 3000 },
  integrations: [tailwind()],
});
```

</details>

## 🛠️ 技术栈

<table>
  <tr>
    <td align="center" width="100">
      <img src="https://astro.build/assets/press/astro-icon-light.svg" width="48" height="48" alt="Astro" />
      <br><strong>Astro</strong>
    </td>
    <td align="center" width="100">
      <img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg" width="48" height="48" alt="Tailwind" />
      <br><strong>Tailwind</strong>
    </td>
    <td align="center" width="100">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" width="48" height="48" alt="TypeScript" />
      <br><strong>TypeScript</strong>
    </td>
    <td align="center" width="100">
      <img src="https://ollama.ai/public/ollama.png" width="48" height="48" alt="Ollama" />
      <br><strong>Ollama</strong>
    </td>
  </tr>
</table>

### 核心技术

- **[Astro.js](https://astro.build/)** `^5.14.3` - 现代静态网站生成器
- **[Tailwind CSS](https://tailwindcss.com/)** `^3.4.18` - 实用优先 CSS 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript 超集
- **[Ollama](https://ollama.ai/)** `^0.6.0` - 本地大语言模型运行时
- **[OpenLLM](https://github.com/bentoml/OpenLLM)** - 生产级 LLM 部署平台

### 开发工具

- **@astrojs/check** - Astro 项目类型检查
- **@astrojs/tailwind** - Astro Tailwind CSS 集成
- **Vite** - 快速的前端构建工具 (Astro 内置)

## 🤖 AI 集成

本项目集成了两个 AI 平台：

### Ollama（本地开发）
- **用途**: 本地开发和测试
- **优势**: 易于安装，快速启动
- **文档**: 查看项目文档了解详情

### OpenLLM（生产部署）
- **用途**: 生产环境部署
- **优势**: 兼容 OpenAI API，支持更多模型
- **文档**: [OPENLLM_INTEGRATION.md](./OPENLLM_INTEGRATION.md)
- **演示页面**: http://localhost:4321/openllm

#### OpenLLM 快速开始

```bash
# 使用 Docker 启动 OpenLLM 服务
docker run -p 3000:3000 ghcr.io/bentoml/openllm start facebook/opt-1.3b

# 或使用 Python
pip install openllm
openllm start facebook/opt-1.3b --port 3000
```

#### OpenLLM API 端点

- `POST /api/openllm-chat` - 聊天对话
- `POST /api/openllm-generate` - 文本生成
- `GET /api/openllm-models` - 获取模型列表
- `GET /api/openllm-health` - 健康检查

详细使用说明请参考 [OPENLLM_INTEGRATION.md](./OPENLLM_INTEGRATION.md)

## 📊 项目状态

- ✅ 基础架构搭建完成
- ✅ Ollama API 集成完成  
- ✅ OpenLLM API 集成完成
- ✅ 聊天界面开发完成
- ✅ 响应式设计完成
- ✅ 错误处理完成
- ✅ TypeScript 支持完成
- ✅ 流式响应支持完成

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. **Fork** 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 **Pull Request**

### 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 规则
- 添加适当的注释和文档
- 确保所有测试通过

## 📄 许可证

本项目采用 **MIT** 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Astro 团队](https://astro.build/team/) - 出色的静态网站生成器
- [Tailwind Labs](https://tailwindlabs.com/) - 优雅的 CSS 框架  
- [Ollama 社区](https://ollama.ai/) - 让本地 AI 变得简单
- 所有开源贡献者 ❤️

---

<div align="center">

**[⭐ 给个星星](https://github.com/yourusername/templ)** • **[🐛 报告问题](https://github.com/yourusername/templ/issues)** • **[💡 功能建议](https://github.com/yourusername/templ/issues)**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>