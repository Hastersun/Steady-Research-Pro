# 🔬 Steady Research Pro

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/Astro-5.14.8-FF5D01?logo=astro)](https://astro.build/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**一个强大的AI驱动研究助手，让深度研究变得简单高效**

[English](README.en.md) | 简体中文

[⚡ 5分钟上手](QUICKSTART.md) • [✨ 功能特性](#-功能特性) • [🚀 快速开始](#-快速开始) • [📖 文档](#-文档) • [🤝 贡献](#-贡献)

</div>

---

## 📖 项目简介

Steady Research Pro 是一个基于 **Astro + Tailwind CSS + Ollama** 构建的现代化智能研究助手平台。它将AI大语言模型与多源信息搜索完美结合，为研究人员、学生、内容创作者提供一站式的深度研究解决方案。

### 🌟 为什么选择 Steady Research Pro？

- 🤖 **多AI服务支持** - 支持本地Ollama、OpenAI、DeepSeek、Claude、Google Gemini等多种AI服务
- 🔍 **智能多源搜索** - 集成Bing、Google搜索API，自动聚合和去重结果
- 📊 **可视化进度追踪** - 实时展示研究进度和推理轨迹
- 🎨 **优雅的用户界面** - 基于Tailwind CSS的现代化响应式设计
- 🔄 **流式数据处理** - 支持实时流式响应，提供流畅的交互体验
- 🌐 **完全开源** - ISC许可证，自由使用和修改

## 💡 核心优势

### 🆓 完全免费
- 开源代码，自由使用和修改
- 支持本地Ollama模型，无需API费用
- 可选接入云端AI服务，灵活选择

### 🔒 隐私安全
- 本地运行模式，数据不上传
- API密钥本地存储
- 完全掌控数据安全

### ⚡ 高性能
- Astro静态生成，极速加载
- 流式响应，实时反馈
- 优化的搜索聚合算法

### 🎨 用户友好
- 直观的操作界面
- 实时进度可视化
- 响应式设计，多设备支持

## ✨ 功能特性

### 核心功能

- 🧠 **智能研究计划生成** - AI自动分析研究主题，生成结构化的研究计划
- 🔍 **多源信息搜索与聚合** - 同时搜索多个搜索引擎，智能去重和排序
- 📈 **实时进度追踪** - 可视化展示研究各阶段的进度和状态
- 🔬 **推理轨迹展示** - 透明展示AI的思考过程和推理链
- 💬 **多AI模型支持** - 灵活切换不同的AI服务和模型

### 技术亮点

- ⚡ **Astro静态生成** - 快速加载，优秀的SEO性能
- 🎨 **Tailwind CSS** - 现代化的响应式UI设计
- 🤖 **Ollama集成** - 支持本地部署的开源AI模型
- 🌊 **流式响应** - Server-Sent Events实现流式数据传输
- 📱 **移动端友好** - 完全响应式设计，支持各种屏幕尺寸
- 🔒 **隐私保护** - 本地运行模式，数据不离开本地

## 📁 项目结构

```
Steady-Research-Pro/
├── src/
│   ├── components/          # Astro组件
│   │   ├── ResearchAgentUI.astro      # 研究界面主组件
│   │   ├── OllamaPanel.astro          # AI服务控制面板
│   │   ├── AIServiceSelector.astro    # AI服务选择器
│   │   └── agent/                     # 研究代理组件
│   │       ├── SidePanel.astro        # 配置侧边栏
│   │       └── ResultsGrid.astro      # 结果展示网格
│   ├── lib/                 # 工具库
│   │   ├── ollama-client.js           # Ollama客户端
│   │   ├── http-api.js                # HTTP API客户端
│   │   ├── search-api-client.js       # 搜索API客户端
│   │   └── research-processor.js      # 研究流程处理器
│   ├── pages/               # 页面和API路由
│   │   ├── index.astro                # 主页
│   │   └── api/                       # API端点
│   │       ├── ollama.js              # Ollama API
│   │       ├── http-api.js            # HTTP LLM API
│   │       ├── research.js            # 研究API
│   │       └── search.js              # 搜索API
│   └── styles/
│       └── global.css                 # 全局样式
├── docs/                    # 文档
│   ├── API.md                         # API文档
│   └── agents-protocol.md             # 代理协议文档
├── tests/                   # 测试文件
└── public/                  # 静态资源
```

## 🚀 快速开始

### 环境要求

- **Node.js** 16 或更高版本
- **npm** 或 **yarn**
- **Ollama** (可选，用于本地AI模型)

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/Hastersun/Steady-Research-Pro.git
   cd Steady-Research-Pro
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   
   打开浏览器访问 `http://localhost:4321`

### 配置AI服务

#### 使用本地Ollama (推荐入门)

1. 安装 [Ollama](https://ollama.ai/)
2. 拉取模型：`ollama pull llama2`
3. 启动Ollama服务
4. 在应用中选择"本地Ollama"

#### 使用云端AI服务

在应用的AI服务选择器中配置你的API密钥：
- OpenAI
- DeepSeek
- Claude (Anthropic)
- Google Gemini

详细配置说明请参考 [AI服务配置文档](AI_SERVICE_SELECTOR_README.md)

### 其他命令

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm test

# 代码格式化
npm run format

# ESLint检查
npm run lint
```

## 📖 文档

- [API 文档](docs/API.md) - 完整的REST API文档
- [AI服务配置](AI_SERVICE_SELECTOR_README.md) - 多AI服务配置指南
- [搜索引擎设置](SEARCH_API_SETUP.md) - Bing和Google搜索API配置
- [代理协议](docs/agents-protocol.md) - 研究代理通信协议
- [功能特性](FEATURES.md) - 详细功能介绍和对比
- [常见问题](FAQ.md) - 常见问题解答
- [贡献指南](CONTRIBUTING.md) - 如何参与项目开发
- [安全政策](SECURITY.md) - 安全问题报告流程
- [更新日志](CHANGELOG.md) - 版本更新历史
- [开发路线图](ROADMAP.md) - 项目未来规划

## 🎯 使用场景

### 适用人群

- 📚 **学术研究者** - 快速收集和整理研究资料
- ✍️ **内容创作者** - 深度调研写作素材
- 👨‍💼 **商业分析师** - 市场调研和竞品分析
- 🎓 **学生** - 课题研究和论文写作
- 💡 **产品经理** - 用户研究和行业趋势分析

### 典型应用

- 学术论文文献综述
- 技术趋势调研报告
- 市场分析和竞品研究
- 新闻事件深度分析
- 知识库构建和整理

## 🤝 贡献

我们欢迎所有形式的贡献！无论是报告bug、提出新功能建议，还是提交代码改进。

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

详细贡献指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 开源许可

本项目采用 [ISC License](LICENSE) 开源许可证。

## 🙏 致谢

感谢以下开源项目和服务：

- [Astro](https://astro.build/) - 现代化的静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Ollama](https://ollama.ai/) - 本地运行大语言模型
- [HyperUI](https://www.hyperui.dev/) - Tailwind CSS组件库

## 💬 联系与支持

- 🐛 [报告Bug](https://github.com/Hastersun/Steady-Research-Pro/issues)
- 💡 [功能建议](https://github.com/Hastersun/Steady-Research-Pro/issues)
- ⭐ 如果这个项目对你有帮助，请给我们一个Star！

---

<div align="center">

**如果觉得项目有帮助，请点击 ⭐Star 支持我们！**

Made with ❤️ by [Hastersun](https://github.com/Hastersun)

</div>
