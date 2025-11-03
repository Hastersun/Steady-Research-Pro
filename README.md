# 🚀 Astro + Tailwind CSS + Ollama AI

<div align="center">

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)

一个现代化的 AI 聊天 Web 应用程序，集成了 Astro.js、Tailwind CSS 和 Ollama AI

[在线演示](http://localhost:4321) • [快速开始](#-快速开始) • [文档](#-文档索引)

</div>

## 🎉 最新更新 v1.2.0

### 🌓 Dark Mode 支持
- ✅ 完整的深色模式功能
- ✅ 自动检测系统主题偏好
- ✅ 一键切换，平滑过渡
- ✅ 主题持久化保存

### ☁️ 云端 LLM 提供商
- ✅ OpenAI (GPT-4, GPT-3.5-turbo)
- ✅ Anthropic Claude (Claude 3 系列)
- ✅ Google Gemini (Gemini Pro, Ultra)
- ✅ 统一接口，动态切换
- ✅ 流式响应支持

[查看完整更新日志](docs/cn/CHANGELOG.md)

## ✨ 功能特性

- 🚀 **Astro.js** - 现代静态网站生成器，零 JavaScript 运行时
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架，快速构建现代 UI
- 🌓 **Dark Mode** - 完整的深色模式支持，自动检测系统偏好
- 🤖 **多 LLM 提供商** - 支持 OpenAI、Anthropic Claude、Google Gemini、Ollama 等
- ☁️ **云端 AI 集成** - 无缝集成主流云端 LLM 服务
- 🏠 **本地 AI 支持** - Ollama 和 OpenLLM 本地部署选项
- 💬 **实时聊天** - 流畅的 AI 对话体验，支持流式响应
- 🔄 **Express.js API** - 独立的 RESTful API 服务器，支持多提供商切换
- 📱 **响应式设计** - 完美适配桌面端和移动端设备
- ⚡ **快速开发** - 热重载开发体验，毫秒级构建速度
- 🛡️ **类型安全** - 完整的 TypeScript 支持
- 🎯 **零配置** - 开箱即用的开发环境
- 🔒 **隐私优先** - 支持完全本地部署，数据不出本地

## 🚀 快速开始

### 前提条件

- Node.js 18+ 
- npm 或 yarn
- (可选) [Ollama](https://ollama.ai/) - 用于本地 AI 模型
- (可选) 云端 LLM API Keys - OpenAI、Anthropic、Google Gemini

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

3. **配置环境变量**
   ```bash
   # 复制环境变量示例文件
   cp .env.example .env
   
   # 编辑 .env 文件，添加你的 API Keys
   # OPENAI_API_KEY=sk-...
   # ANTHROPIC_API_KEY=sk-ant-...
   # GOOGLE_API_KEY=AIzaSy...
   ```

4. **(可选) 设置本地 Ollama**
   ```bash
   # 下载并安装 Ollama (访问 https://ollama.ai)
   # 启动 Ollama 服务
   ollama serve
   
   # 在新终端中下载模型
   ollama pull llama2
   ```

5. **启动开发服务器**
   ```bash
   # Terminal 1: 启动 Express API 服务器
   npm run server:dev
   
   # Terminal 2: 启动 Astro 开发服务器
   npm run dev
   ```

6. **打开浏览器**
   
   访问 [http://localhost:4321](http://localhost:4321) 开始使用！

## 🌐 支持的 LLM 提供商

### 云端提供商
- **OpenAI** - GPT-4, GPT-3.5-turbo 等
- **Anthropic** - Claude 3 Opus, Sonnet, Haiku
- **Google** - Gemini Pro, Ultra

### 本地提供商
- **Ollama** - Llama2, CodeLlama, Mistral 等
- **OpenLLM** - 兼容 OpenAI API 的本地部署

详细配置请参考 [云端 LLM 集成指南](docs/cn/integration/CLOUD_LLM_INTEGRATION.md)

## 🌓 Dark Mode（深色模式）

项目内置完整的深色模式支持，提供更舒适的使用体验。

### 主要特性

- **自动检测** - 自动检测系统主题偏好
- **一键切换** - 页面右上角的主题切换按钮
- **持久化** - 主题选择保存在 localStorage
- **平滑过渡** - 优雅的颜色过渡动画
- **无闪烁** - 页面加载时无主题闪烁

### 快速使用

```astro
<!-- 在 Astro 组件中使用 dark: 变体 -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-black dark:text-white">标题</h1>
</div>
```

```tsx
// 在 React 组件中
<button className="bg-blue-500 dark:bg-blue-700">
  按钮
</button>
```

### 自定义主题颜色

编辑 `src/styles/globals.css` 自定义颜色：

```css
:root {
  --background: 0 0% 100%;        /* 浅色背景 */
  --foreground: 222.2 84% 4.9%;   /* 浅色文字 */
}

.dark {
  --background: 222.2 84% 4.9%;   /* 深色背景 */
  --foreground: 210 40% 98%;      /* 深色文字 */
}
```

📚 **完整文档**: 查看 [Dark Mode 使用指南](docs/cn/features/DARK_MODE_GUIDE.md) 了解更多详情

## 📁 项目结构

```
📦 utemplate-main/
├── 📂 public/                     # 静态资源
│   └── favicon.svg
├── 📂 src/
│   ├── 📂 components/             # React & Astro 组件
│   │   ├── Dashboard.tsx          # 仪表盘组件
│   │   ├── FileUpload.tsx         # 文件上传组件
│   │   ├── Research.tsx           # 研究组件
│   │   ├── Settings.tsx           # 设置组件
│   │   ├── ThemeToggle.tsx        # 主题切换组件 🌓
│   │   └── ui/                    # shadcn/ui 组件库
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   ├── 📂 layouts/                # 页面布局
│   │   └── Layout.astro           # 主布局（包含 Dark Mode）
│   ├── 📂 lib/                    # 工具库
│   │   ├── config.ts              # 应用配置（LLM 提供商）
│   │   ├── llm-providers.ts       # 统一 LLM 接口 ☁️
│   │   ├── ollama.ts              # Ollama API 封装
│   │   └── utils.ts               # 工具函数
│   ├── 📂 routes/                 # Express 路由
│   │   ├── chat.ts                # 聊天路由（多提供商）
│   │   └── models.ts              # 模型管理路由
│   ├── 📂 pages/                  # Astro 页面路由
│   │   ├── 📂 api/                # Astro API 端点
│   │   │   ├── chat.ts            # 聊天 API
│   │   │   └── models.ts          # 模型列表 API
│   │   ├── index.astro            # 首页（Research）
│   │   ├── settings.astro         # 设置页面
│   │   └── upload.astro           # 文件上传页面
│   ├── 📂 styles/                 # 样式文件
│   │   └── globals.css            # 全局样式（Dark Mode 变量）
│   ├── env.d.ts                   # 环境类型定义
│   └── server.ts                  # Express 服务器
├── 📂 docs/                       # 项目文档
│   ├── 📂 cn/                     # 中文文档
│   │   ├── 📂 features/           # 功能文档
│   │   │   ├── DARK_MODE_GUIDE.md        # Dark Mode 完整指南 🌓
│   │   │   └── DARK_MODE_QUICK_REF.md    # Dark Mode 快速参考 🌓
│   │   ├── 📂 integration/        # 集成指南
│   │   │   ├── CLOUD_LLM_INTEGRATION.md         # 云端 LLM 集成 ☁️
│   │   │   ├── CLOUD_LLM_INTEGRATION_SUMMARY.md # 集成总结 ☁️
│   │   │   ├── EXPRESS_INTEGRATION_SUMMARY.md
│   │   │   └── REACT_SHADCN_INTEGRATION.md
│   │   ├── 📂 testing/            # 测试文档
│   │   │   ├── CLOUD_LLM_QUICK_TEST.md  # 云端 LLM 测试 ☁️
│   │   │   └── QUICK_TEST.md
│   │   ├── CHANGELOG.md           # 变更日志
│   │   └── QUICK_REFERENCE.md     # 快速参考 ☁️
│   └── 📂 en/                     # 英文文档
│       ├── 📂 integration/
│       │   └── CLOUD_LLM_INTEGRATION.en.md  # 英文集成指南 ☁️
│       └── CHANGELOG.en.md
├── .env.example                   # 环境变量示例（含 API Keys）
├── astro.config.mjs               # Astro 配置
├── components.json                # shadcn/ui 配置
├── tailwind.config.mjs            # Tailwind 配置（Dark Mode）
├── tsconfig.json                  # TypeScript 配置
├── package.json                   # 项目依赖
└── DEPLOYMENT_CHECKLIST.md        # 部署检查清单

图例: 🌓 Dark Mode 相关 | ☁️ 云端 LLM 相关
```

## 📚 文档索引

### 快速开始
- [快速开始指南](#-快速开始) - 5 分钟快速搭建
- [环境配置](#环境配置) - 配置开发环境
- [使用说明](#-使用说明) - 基本操作指南

### 功能特性
- **🌓 [Dark Mode 指南](docs/cn/features/DARK_MODE_GUIDE.md)** - 深色模式完整文档
  - [快速参考](docs/cn/features/DARK_MODE_QUICK_REF.md)
- **☁️ [云端 LLM 集成](docs/cn/integration/CLOUD_LLM_INTEGRATION.md)** - 多提供商支持
  - [快速测试](docs/cn/testing/CLOUD_LLM_QUICK_TEST.md)
  - [集成总结](docs/cn/integration/CLOUD_LLM_INTEGRATION_SUMMARY.md)
  - [快速参考](docs/cn/QUICK_REFERENCE.md)

### 集成指南
- [Express 集成](docs/cn/integration/EXPRESS_INTEGRATION_SUMMARY.md)
- [React + shadcn/ui 集成](docs/cn/integration/REACT_SHADCN_INTEGRATION.md)
- [OpenLLM 集成](docs/cn/integration/OPENLLM_INTEGRATION.md)
- [Supabase 集成](docs/cn/integration/SUPABASE_INTEGRATION.md)

### API 文档
- [Express API 参考](docs/api/express-api.md)
- [API 端点说明](#-api-接口)

### 测试文档
- [快速测试指南](docs/cn/testing/QUICK_TEST.md)
- [云端 LLM 测试](docs/cn/testing/CLOUD_LLM_QUICK_TEST.md)
- [OpenLLM 测试](docs/cn/testing/OPENLLM_QUICK_TEST.md)

### 其他
- [变更日志](docs/cn/CHANGELOG.md)
- [部署检查清单](DEPLOYMENT_CHECKLIST.md)
- [贡献指南](#-贡献指南)

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
      <img src="https://react.dev/favicon.ico" width="48" height="48" alt="React" />
      <br><strong>React</strong>
    </td>
    <td align="center" width="100">
      <img src="https://ollama.ai/public/ollama.png" width="48" height="48" alt="Ollama" />
      <br><strong>Ollama</strong>
    </td>
  </tr>
</table>

### 核心技术

- **[Astro.js](https://astro.build/)** `^5.14.3` - 现代静态网站生成器
- **[React](https://react.dev/)** `^19.2.0` - 用户界面库（Islands Architecture）
- **[Tailwind CSS](https://tailwindcss.com/)** `^3.4.18` - 实用优先 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 可定制的 React 组件库
- **[TypeScript](https://www.typescriptlang.org/)** `^5.9.3` - 类型安全的 JavaScript 超集
- **[Express.js](https://expressjs.com/)** `^5.1.0` - Node.js Web 应用框架

### AI 集成

- **[Ollama](https://ollama.ai/)** `^0.6.0` - 本地大语言模型运行时
- **[OpenAI API](https://platform.openai.com/)** - GPT-4, GPT-3.5-turbo
- **[Anthropic Claude](https://www.anthropic.com/)** - Claude 3 系列
- **[Google Gemini](https://ai.google.dev/)** - Gemini Pro, Ultra
- **[OpenLLM](https://github.com/bentoml/OpenLLM)** - 生产级 LLM 部署平台

### UI 组件库

- **[@radix-ui/react-avatar](https://www.radix-ui.com/)** - 无障碍头像组件
- **[@radix-ui/react-label](https://www.radix-ui.com/)** - 表单标签组件
- **[@radix-ui/react-slot](https://www.radix-ui.com/)** - 组件组合工具
- **[lucide-react](https://lucide.dev/)** `^0.546.0` - 精美图标库
- **[class-variance-authority](https://cva.style/)** - 样式变体管理
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Tailwind 类名合并
- **[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)** - 动画工具

### 开发工具

- **@astrojs/check** - Astro 项目类型检查
- **@astrojs/react** - Astro React 集成
- **@astrojs/tailwind** - Astro Tailwind CSS 集成
- **tsx** - TypeScript 执行器
- **nodemon** - 文件监听和自动重启
- **Vite** - 快速的前端构建工具（Astro 内置）

### 后端服务

- **cors** - 跨域资源共享中间件
- **dotenv** - 环境变量管理

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

### 已完成功能 ✅
- ✅ 基础架构搭建
- ✅ Ollama API 集成  
- ✅ OpenLLM API 集成
- ✅ **云端 LLM 提供商集成** (v1.1.0)
  - OpenAI
  - Anthropic Claude
  - Google Gemini
- ✅ **Dark Mode 深色模式** (v1.2.0)
- ✅ 聊天界面开发
- ✅ 响应式设计
- ✅ 错误处理
- ✅ TypeScript 支持
- ✅ 流式响应支持
- ✅ shadcn/ui 组件库集成
- ✅ 主题切换功能

### 开发中功能 🚧
- 🚧 用户认证系统（Supabase Auth）
- 🚧 对话历史管理
- 🚧 多轮对话上下文
- 🚧 RAG（检索增强生成）集成

### 计划功能 📋
- 📋 函数调用支持
- 📋 多模态输入（图片、音频）
- 📋 Agent 工作流
- 📋 团队协作功能
- 📋 API 使用量统计
- 📋 成本监控

### 版本历史
- **v1.2.0** (2025-11-03) - Dark Mode + 文档更新
- **v1.1.0** (2025-11-03) - 云端 LLM 提供商支持
- **v1.0.0** (2025-10-10) - 初始版本发布

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