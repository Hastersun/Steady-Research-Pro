# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-11-06

### Added
- 📤 **Configuration Export/Import** - Complete config management in Settings component
  - JSON file export with custom filename
  - Custom filename dialog with config preview
  - Smart default naming (model + date + time)
  - JSON file import (button and drag-drop)
  - Configuration validation and error handling
- 🎨 **Drag & Drop Import** - Intuitive file upload experience
  - Visual feedback (border highlight, background change)
  - Filename display during dragging
  - File type validation (.json only)
  - Real-time drag state tracking
- ✨ **Rich Interactive Animations** - Enhanced user experience
  - Pulse ripple effects (during drag)
  - Gradient background animations
  - Icon animations (scale, rotate, bounce)
  - Text breathing effects
  - Success celebration animations (✨⭐🎉✅)
  - Dynamic border corners
  - Container scale and shadow effects
  - Smooth state transitions
- 📋 **Filename Tracking Display** - Clear file status feedback
  - Real-time display of dragging filename
  - Highlight imported filename on success
  - Persistent display of last imported file
  - Visual distinction by state (blue/green/default)

### Changed
- 🎯 **Enhanced Settings Component** - Improved config management UX
  - Refactored import/export area layout
  - Added configuration preview card
  - Improved error messages
- 💅 **UI/UX Improvements** - More intuitive interaction design
  - Added filename display card with animations
  - Export dialog includes current config summary
  - Unified visual feedback system

### Technical Details
- React hooks for drag-drop state management
- FileReader API for file reading
- Blob API for file download generation
- shadcn/ui Dialog component integration
- Multi-layer animation stacking
- localStorage config persistence

## [1.2.0] - 2025-11-03

### Added
- 🌓 **Dark Mode Support** - Complete dark mode functionality
  - Created `ThemeToggle` React component for theme switching
  - Anti-flash script for seamless page load
  - Automatic system theme preference detection
  - Theme persistence to localStorage
  - Smooth color transition animations
- 🎨 **Theme Toggle Button** - Visual theme switcher in navigation bar
  - Moon icon (light mode)
  - Sun icon (dark mode)
  - Keyboard navigation and screen reader support
- 📚 **Dark Mode Documentation** - Complete usage and customization guides
  - `docs/cn/features/DARK_MODE_GUIDE.md` - Complete guide (Chinese)
  - `docs/en/features/DARK_MODE_QUICK_REF.en.md` - Quick reference (English)
  - `docs/cn/features/DARK_MODE_QUICK_REF.md` - Quick reference (Chinese)

### Changed
- 🎨 **Updated Layout** - `Layout.astro` integrated theme toggle
- 💅 **Optimized CSS** - Added smooth transition effects for theme switching
- 🎯 **Improved Accessibility** - Theme toggle includes complete ARIA labels

### Technical Details
- React hooks for theme state management
- CSS variables for dynamic theme switching
- System theme preference detection (`prefers-color-scheme`)
- localStorage theme persistence
- Tailwind CSS `dark:` variant support

## [1.1.0] - 2025-11-03

### Added
- ☁️ **Cloud LLM Provider Support** - Integration with multiple cloud AI services
  - OpenAI (GPT-4, GPT-3.5-turbo, etc.)
  - Anthropic Claude (Claude 3 Opus, Sonnet, Haiku)
  - Google Gemini (Gemini Pro, Ultra)
- 🔄 **Unified LLM Interface** - Common LLM provider interface (`src/lib/llm-providers.ts`)
- 🎯 **Dynamic Provider Switching** - API endpoints support provider parameter selection
- 📡 **Provider Status Query** - New `/api/chat/providers` endpoint for provider status
- 🌊 **Unified Streaming** - All providers support Server-Sent Events (SSE) streaming
- 🔐 **Environment Configuration** - Extended `.env.example` with cloud provider API Keys
- 📚 **Complete Documentation** - Cloud LLM integration and testing guides
  - `docs/cn/integration/CLOUD_LLM_INTEGRATION.md`
  - `docs/en/integration/CLOUD_LLM_INTEGRATION.en.md`
  - `docs/cn/testing/CLOUD_LLM_QUICK_TEST.md`
  - `docs/cn/integration/CLOUD_LLM_INTEGRATION_SUMMARY.md`
  - `docs/cn/QUICK_REFERENCE.md`

### Changed
- ♻️ **Refactored Routes** - Updated `src/routes/chat.ts` for multi-provider support
- 🔧 **Extended Config** - Added all provider configurations in `src/lib/config.ts`
- 📝 **Updated README** - Cloud LLM provider usage instructions

### Technical Details
- Native Fetch API implementation, no extra SDK dependencies
- `ILLMProvider` interface for consistent behavior
- Support for both streaming and non-streaming modes
- Complete type safety and error handling

### API Changes
- All chat APIs now accept `provider` parameter
  ```json
  {
    "message": "Your message",
    "provider": "openai|anthropic|google|ollama|openllm",
    "model": "specific model name"
  }
  ```

## [1.0.0] - 2025-10-31

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
- ⚛️ React 19 integration with Astro Islands architecture
- 🎯 shadcn/ui component library integration
- 🔄 Express.js API server with streaming support
- 📖 Complete English documentation

### Features
- Interactive chat interface with AI models
- Support for multiple Ollama models (llama2, codellama, mistral, etc.)
- Real-time connection status monitoring
- Responsive design with Tailwind CSS
- TypeScript support throughout the project
- Error handling and user feedback
- Clean and modern UI/UX design
- React components with Islands architecture for optimal performance
- shadcn/ui components (Button, Card, Input, Label, Badge, Avatar)
- Dark/Light theme support with CSS variables
- Dual-server architecture (Astro + Express)
- Streaming responses with Server-Sent Events (SSE)

### Technical Details
- **Framework**: Astro.js v5.14.3 (Static Site Generator)
- **UI Library**: React v19.0.0 (Component library)
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v3.4.18 (Utility-first CSS)
- **AI Integration**: Ollama v0.6.0 (Local LLM runtime)
- **API Server**: Express.js v5.1.0 (Backend API)
- **Language**: TypeScript (Type-safe development)
- **Build Tool**: Vite (Fast development and building)
- **Dev Tools**: tsx, nodemon for hot reload

### API Endpoints

#### Astro API Routes (Port 4321)
- `GET /api/models` - Retrieve available Ollama models
- `POST /api/chat` - Send messages to AI models

#### Express API Routes (Port 3000)
- `GET /health` - Health check endpoint
- `GET /api/models` - Retrieve available Ollama models
- `GET /api/models/:name` - Get specific model information
- `POST /api/chat` - Send messages to AI models (non-streaming)
- `POST /api/chat/stream` - Send messages to AI models (streaming with SSE)

### Project Structure
```
src/
├── components/
│   ├── Dashboard.tsx         # Main dashboard component
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── config.ts             # Application configuration
│   ├── ollama.ts             # Ollama API service layer
│   └── utils.ts              # Utility functions
├── routes/
│   ├── chat.ts               # Express chat routes
│   └── models.ts             # Express model routes
├── pages/
│   ├── api/                  # Astro API endpoints
│   └── index.astro           # Homepage with dashboard
├── styles/
│   └── globals.css           # Global styles and theme variables
└── server.ts                 # Express server entry point
```

### Documentation
- `README.md` - Chinese documentation
- `README.en.md` - English documentation
- `docs/integration/EXPRESS_INTEGRATION_SUMMARY.md` - Express integration guide (Chinese)
- `docs/integration/EXPRESS_INTEGRATION_SUMMARY.en.md` - Express integration guide (English)
- `docs/integration/REACT_SHADCN_INTEGRATION.md` - React + shadcn/ui guide (Chinese)
- `docs/integration/REACT_SHADCN_INTEGRATION.en.md` - React + shadcn/ui guide (English)
- `docs/testing/QUICK_TEST.md` - Quick test guide (Chinese)
- `docs/testing/QUICK_TEST.en.md` - Quick test guide (English)
- `docs/CHANGELOG.md` - Changelog (Chinese)
- `docs/CHANGELOG.en.md` - Changelog (English)

### Removed
- 🗑️ Removed unused components (ExampleComponent, Chat.astro, OpenLLMChat, AuthComponent, ProfileManager, SupabaseIntegration)
- 🗑️ Removed OpenLLM integration files (not currently used)
- 🗑️ Removed Supabase integration files (not currently used)
- 🗑️ Removed redundant documentation files

---

## Future Roadmap

### [1.1.0] - Planned
- [ ] 💾 Chat history persistence with local storage
- [ ] 🎯 Custom model parameters configuration UI
- [ ] 📤 Export chat conversations (Markdown, JSON, PDF)
- [ ] 🔍 Search within chat history
- [ ] 📌 Pin important conversations

### [1.2.0] - Planned
- [ ] 🔐 Optional user authentication system
- [ ] 📁 File upload and analysis capability
- [ ] 🌐 Multi-language support (i18n)
- [ ] 📊 Usage analytics dashboard
- [ ] 🤖 Custom AI prompt templates library
- [ ] 🎨 Theme customization UI
- [ ] 🔄 Model comparison mode (side-by-side)

### [2.0.0] - Future
- [ ] 🚀 Production deployment guides for major platforms
- [ ] 🔌 Plugin system for extensions
- [ ] 📱 Progressive Web App (PWA) support
- [ ] 🤝 Team collaboration features
- [ ] 🎙️ Voice input/output support
- [ ] 🖼️ Image generation integration
- [ ] 📈 Advanced analytics and insights

---

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
