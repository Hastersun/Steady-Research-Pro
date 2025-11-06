# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-11-06

### Added
- 📤 **配置文件导出/导入功能** - Settings 组件新增完整的配置管理
  - JSON 文件导出功能，支持自定义文件名
  - 自定义文件名对话框，包含配置预览
  - 智能默认文件名（包含模型、日期、时间信息）
  - JSON 文件导入功能（按钮和拖放两种方式）
  - 配置验证和错误处理
- 🎨 **拖放导入支持** - 直观的拖放文件上传体验
  - 拖放区域视觉反馈（边框高亮、背景变化）
  - 拖放过程中的文件名显示
  - 文件类型验证（仅接受 .json 文件）
  - 实时拖放状态追踪
- ✨ **丰富的交互动画** - 提升用户体验的视觉效果
  - 脉冲波纹效果（拖放时）
  - 渐变背景动画
  - 图标动画（缩放、旋转、弹跳）
  - 文字呼吸效果
  - 成功庆祝动画（✨⭐🎉✅）
  - 动态边框角标
  - 容器放大和阴影效果
  - 平滑的状态过渡动画
- 📋 **文件名追踪显示** - 清晰的文件状态反馈
  - 拖拽中的文件名实时显示
  - 导入成功时的文件名高亮
  - 最后导入文件名的持久化显示
  - 不同状态的视觉区分（蓝色/绿色/默认主题）

### Changed
- 🎯 **优化 Settings 组件** - 增强配置管理用户体验
  - 重构导入/导出区域布局
  - 添加配置预览卡片
  - 改进错误提示信息
- 💅 **UI/UX 改进** - 更直观的交互设计
  - 添加文件名显示卡片（带动画）
  - 导出对话框包含当前配置摘要
  - 统一的视觉反馈系统

### Technical Details
- 使用 React hooks 管理拖放状态
- FileReader API 处理文件读取
- Blob API 生成下载文件
- shadcn/ui Dialog 组件集成
- 多层动画叠加效果
- localStorage 持久化配置

## [1.2.0] - 2025-11-03

### Added
- 🌓 **Dark Mode 支持** - 完整的深色模式功能
  - 创建 `ThemeToggle` React 组件实现主题切换
  - 添加防闪烁脚本，页面加载时无闪烁
  - 自动检测系统主题偏好
  - 主题偏好持久化到 localStorage
  - 平滑的颜色过渡动画效果
- 🎨 **主题切换按钮** - 在导航栏添加可视化的主题切换按钮
  - 月亮图标（浅色模式）
  - 太阳图标（深色模式）
  - 支持键盘导航和屏幕阅读器
- 📚 **Dark Mode 文档** - 完整的使用和自定义指南
  - `docs/cn/features/DARK_MODE_GUIDE.md` - 完整指南
  - `docs/cn/features/DARK_MODE_QUICK_REF.md` - 快速参考

### Changed
- 🎨 **更新布局** - `Layout.astro` 集成主题切换功能
- 💅 **优化 CSS** - 添加主题切换的平滑过渡效果
- 🎯 **改进无障碍性** - 主题切换按钮包含完整的 ARIA 标签

### Technical Details
- 使用 React hooks 管理主题状态
- CSS 变量实现动态主题切换
- 支持系统主题偏好检测 (`prefers-color-scheme`)
- localStorage 持久化主题选择
- Tailwind CSS `dark:` 变体支持

## [1.1.0] - 2025-11-03

### Added
- ☁️ **云端 LLM 提供商支持** - 新增对多个云端 AI 服务的集成
  - OpenAI (GPT-4, GPT-3.5-turbo, 等)
  - Anthropic Claude (Claude 3 Opus, Sonnet, Haiku)
  - Google Gemini (Gemini Pro, Ultra)
- 🔄 **统一 LLM 接口** - 创建了通用的 LLM 提供商接口 (`src/lib/llm-providers.ts`)
- 🎯 **动态提供商切换** - API 端点支持通过参数选择不同的 LLM 提供商
- 📡 **提供商状态查询** - 新增 `/api/chat/providers` 端点查询所有提供商状态
- 🌊 **统一流式响应** - 所有提供商都支持 Server-Sent Events (SSE) 流式响应
- 🔐 **环境变量配置** - 扩展 `.env.example` 包含所有云端提供商的 API Key 配置
- 📚 **完整文档** - 新增云端 LLM 集成指南和快速测试文档
  - `docs/cn/integration/CLOUD_LLM_INTEGRATION.md`
  - `docs/en/integration/CLOUD_LLM_INTEGRATION.en.md`
  - `docs/cn/testing/CLOUD_LLM_QUICK_TEST.md`

### Changed
- ♻️ **重构路由处理** - 更新 `src/routes/chat.ts` 支持多提供商架构
- 🔧 **扩展配置系统** - 在 `src/lib/config.ts` 中添加所有提供商的配置
- 📝 **更新 README** - 添加云端 LLM 提供商使用说明

### Technical Details
- 使用原生 Fetch API 实现所有云端提供商集成，无需额外 SDK 依赖
- 实现了 `ILLMProvider` 接口确保所有提供商行为一致
- 支持非流式和流式两种响应模式
- 完整的类型安全和错误处理

### API Changes
- 所有聊天 API 现在接受 `provider` 参数来指定 LLM 提供商
  ```json
  {
    "message": "你的消息",
    "provider": "openai|anthropic|google|ollama|openllm",
    "model": "具体模型名称"
  }
  ```

## [1.0.0] - 2025-10-10

### Added
- ✨ Initial project setup with Astro.js framework
- 🎨 Tailwind CSS integration for modern UI styling
- 🤖 Ollama AI integration for local LLM support
- 💬 Real-time chat interface with AI models
- 📱 Responsive design for desktop and mobile devices
- 🛡️ Complete TypeScript support for type safety
- 🔌 RESTful API endpoints for chat and model management
- 📊 Model selection and connection status monitoring
- 🚀 Hot reload development environment
- 📚 Comprehensive documentation and setup guide

### Features
- Interactive chat interface with AI models
- Support for multiple Ollama models (llama2, codellama, mistral, etc.)
- Real-time connection status monitoring
- Responsive design with Tailwind CSS
- TypeScript support throughout the project
- Error handling and user feedback
- Clean and modern UI/UX design

### Technical Details
- **Framework**: Astro.js v5.14.3 (Static Site Generator)
- **Styling**: Tailwind CSS v3.4.18 (Utility-first CSS)
- **AI Integration**: Ollama v0.6.0 (Local LLM runtime)
- **Language**: TypeScript (Type-safe development)
- **Build Tool**: Vite (Fast development and building)

### API Endpoints
- `GET /api/models` - Retrieve available Ollama models
- `POST /api/chat` - Send messages to AI models

### Project Structure
```
src/
├── components/Chat.astro    # Main chat interface
├── lib/
│   ├── config.ts           # Application configuration
│   └── ollama.ts           # Ollama API service layer
├── pages/
│   ├── api/               # REST API endpoints
│   ├── index.astro        # Landing page
│   └── chat.astro         # Chat application page
└── ...
```

---

## Future Roadmap

### [1.1.0] - Planned
- [ ] 🔄 Streaming responses for real-time AI output
- [ ] 💾 Chat history persistence
- [ ] 🎯 Custom model parameters configuration
- [ ] 🌙 Dark mode toggle
- [ ] 📤 Export chat conversations

### [1.2.0] - Planned  
- [ ] 🔐 User authentication system
- [ ] 📁 File upload and analysis
- [ ] 🌐 Multi-language support (i18n)
- [ ] 📊 Usage analytics dashboard
- [ ] 🤖 Custom AI prompt templates