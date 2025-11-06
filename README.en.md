# 🚀 Astro + Tailwind CSS + Ollama AI

<div align="center">

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)

A modern AI chat web application built with Astro.js, Tailwind CSS, and Ollama AI

[Live Demo](http://localhost:4321) • [Quick Start](#-quick-start) • [Documentation](#-project-structure)

</div>

## ✨ Features

- 🚀 **Astro.js** - Modern static site generator with zero JavaScript runtime
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid modern UI development
- 🌓 **Dark Mode** - Complete dark mode support with system preference detection
- 🤖 **Multi LLM Providers** - Support for OpenAI, Anthropic Claude, Google Gemini, Ollama, etc.
- ☁️ **Cloud AI Integration** - Seamless integration with major cloud LLM services
- 🏠 **Local AI Support** - Ollama and OpenLLM local deployment options
- 💬 **Real-time Chat** - Smooth AI conversation experience with streaming responses
- ⚙️ **Config Management** - JSON export/import, drag-drop upload, config backup & sharing
- 🎭 **Rich Animations** - Pulse, ripple, bounce and various interactive animation effects
- 🔄 **Express.js API** - Independent RESTful API server with multi-provider switching
- 📱 **Responsive Design** - Perfect adaptation for desktop and mobile devices
- ⚡ **Fast Development** - Hot reload development experience with millisecond build speed
- 🛡️ **Type Safety** - Complete TypeScript support
- 🎯 **Zero Configuration** - Out-of-the-box development environment
- 🔒 **Privacy First** - Support for complete local deployment, data stays local

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- [Ollama](https://ollama.ai/) (for local AI models)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd templ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install and start Ollama**
   ```bash
   # Download and install Ollama (visit https://ollama.ai)
   # Start Ollama service
   ollama serve
   
   # Download models in a new terminal
   ollama pull llama2
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   
   Visit [http://localhost:4321](http://localhost:4321) to get started!

## 📁 Project Structure

```
📦 templ/
├── 📂 public/                     # Static assets
│   └── favicon.svg
├── 📂 src/
│   ├── 📂 components/             # React components
│   │   ├── Dashboard.tsx          # Main dashboard component
│   │   └── ui/                    # shadcn/ui components
│   ├── 📂 lib/                    # Utility libraries
│   │   ├── config.ts              # Application configuration
│   │   ├── ollama.ts              # Ollama API wrapper
│   │   └── utils.ts               # Utility functions
│   ├── 📂 routes/                 # Express routes
│   │   ├── chat.ts                # Chat routes
│   │   └── models.ts              # Model management routes
│   ├── 📂 pages/                  # Astro page routes
│   │   ├── 📂 api/                # Astro API endpoints
│   │   │   ├── chat.ts            # Chat API
│   │   │   └── models.ts          # Models list API
│   │   └── index.astro            # Homepage
│   ├── 📂 styles/                 # Global styles
│   │   └── globals.css            # Global CSS
│   └── server.ts                  # Express server
├── 📂 docs/                       # Project documentation
│   ├── 📂 integration/            # Integration guides
│   └── 📂 testing/                # Testing documentation
├── .env.example                   # Environment variables example
├── astro.config.mjs               # Astro configuration
├── tailwind.config.mjs            # Tailwind configuration
└── package.json                   # Project dependencies
```

## 🎯 Usage Guide

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Astro development server (http://localhost:4321) |
| `npm run build` | Build production version to `dist/` |
| `npm run preview` | Preview built website |
| `npm run server` | Start Express API server (http://localhost:3000) |
| `npm run server:dev` | Start Express in development mode (auto-restart) |
| `npm run server:watch` | Start Express with file watching (auto-restart on changes) |

### Dual Server Architecture

This project supports two running modes:

#### 1. Astro Only (Using Astro API Routes)
```bash
npm run dev
```
Visit http://localhost:4321

#### 2. Astro + Express (Recommended)
Run in two separate terminal windows:

**Terminal 1 - Astro Frontend:**
```bash
npm run dev
```

**Terminal 2 - Express Backend:**
```bash
npm run server:dev
```

Then access:
- **Astro Frontend**: http://localhost:4321
- **Express API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Express server port
PORT=3000

# CORS configuration
CORS_ORIGIN=http://localhost:4321

# Ollama service address
OLLAMA_HOST=http://localhost:11434
```

### Feature Usage

1. **Visit Homepage** - View project introduction and feature overview
2. **Enter Chat** - Start chatting with AI models
3. **Select Model** - Choose different AI models at the top of chat interface
4. **Start Conversation** - Enter message and press Enter or click send button

### Supported AI Models

The project supports all models installed via Ollama:

| Model | Size | Features | Download Command |
|-------|------|----------|------------------|
| **llama2** | 3.8GB | General conversation model | `ollama pull llama2` |
| **codellama** | 3.8GB | Code generation expert | `ollama pull codellama` |
| **mistral** | 4.1GB | Efficient multilingual model | `ollama pull mistral` |
| **neural-chat** | 4.1GB | Conversation optimized model | `ollama pull neural-chat` |
| **starling-lm** | 4.1GB | Instruction following model | `ollama pull starling-lm` |

> 💡 **Tip**: First-time use requires model download, recommend starting with `llama2`

## 📡 API Endpoints

### Astro API Routes (Port 4321)

These endpoints are integrated into the Astro application, suitable for simple SSR scenarios.

#### `GET /api/models`
Get list of available Ollama models

#### `POST /api/chat`
Send message to AI model for conversation

### Express API Server (Port 3000)

Independent RESTful API server providing more powerful features and streaming response support.

#### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-13T12:00:00.000Z",
  "uptime": 3600.5
}
```

#### `GET /api/models`
Get list of available Ollama models

**Response Example:**
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
Send message to AI model for conversation (non-streaming)

**Request Body:**
```json
{
  "message": "Explain what Astro.js is",
  "model": "llama2"
}
```

**Response Example:**
```json
{
  "success": true,
  "data": "Astro.js is a modern static site generator that uses Islands Architecture...",
  "model": "llama2"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message content cannot be empty"
}
```

#### `POST /api/chat/stream`
Send message to AI model for conversation (streaming response)

**Request Body:**
```json
{
  "message": "Write a poem about spring",
  "model": "llama2"
}
```

**Response Format:** Server-Sent Events (SSE)

```
data: {"content":"Spring"}
data: {"content":" is"}
data: {"content":" here"}
data: [DONE]
```

📚 **Complete API Documentation**: See [Express API Documentation](docs/api/express-api.md) for more details

## ⚙️ Configuration

### Ollama Configuration

Customize Ollama settings in `src/lib/config.ts`:

```typescript
export const OLLAMA_CONFIG = {
  HOST: 'http://localhost:11434',     // Ollama server address
  DEFAULT_MODEL: 'llama2',            // Default model
  REQUEST_TIMEOUT: 30000,             // Request timeout (30 seconds)
  
  // Supported models list
  FALLBACK_MODELS: [
    'llama2', 'codellama', 'mistral', 
    'neural-chat', 'starling-lm'
  ],
  
  // API endpoint configuration
  ENDPOINTS: {
    HEALTH: '/api/version',
    MODELS: '/api/tags', 
    CHAT: '/api/chat'
  }
};
```

### Environment Variables

Create `.env.local` file for personalized configuration:

```env
# Ollama server address (optional)
OLLAMA_HOST=http://localhost:11434

# Default model (optional)
DEFAULT_MODEL=llama2

# Request timeout (optional)
REQUEST_TIMEOUT=30000
```

### Tailwind CSS Customization

Modify style theme in `tailwind.config.mjs`:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Custom primary color
        secondary: '#10B981',   // Custom secondary color
      }
    },
  },
  plugins: [],
}
```

## 🔧 Troubleshooting

<details>
<summary><strong>❌ Ollama Service Connection Failed</strong></summary>

**Symptoms**: Chat interface shows "Connection failed", cannot get model list

**Solutions**:
1. Check Ollama service status
   ```bash
   ollama serve
   ```

2. Verify service port (default 11434)
   ```bash
   curl http://localhost:11434/api/version
   ```

3. Check firewall settings, ensure port is accessible

4. Confirm models are downloaded
   ```bash
   ollama list
   ```

</details>

<details>
<summary><strong>🐌 Slow Model Response</strong></summary>

**Possible Causes and Solutions**:

- **Insufficient Memory**: Ensure system has enough memory (recommended 8GB+)
- **Model Too Large**: Try smaller models (`llama2:7b` vs `llama2:70b`)
- **High CPU Load**: Close other CPU-intensive programs
- **Disk I/O**: Ensure models are stored on SSD

**Performance Optimization Tips**:
```bash
# Use quantized models (smaller but similar performance)
ollama pull llama2:7b-q4_0

# Set concurrency limit
export OLLAMA_NUM_PARALLEL=1
```

</details>

<details>
<summary><strong>🚫 Build Errors</strong></summary>

**Common Issues**:

1. **Node.js Version**: Ensure using Node.js 18+
2. **Dependency Conflicts**: Delete `node_modules` and `package-lock.json`, reinstall
3. **TypeScript Errors**: Run `npm run astro check` to check types

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be >= 18.0.0
```

</details>

<details>
<summary><strong>🌐 Port Already in Use</strong></summary>

If default port 4321 is occupied:

```bash
# Start with different port
npm run dev -- --port 3000

# Or modify astro.config.mjs
export default defineConfig({
  server: { port: 3000 },
  integrations: [tailwind()],
});
```

</details>

## 🛠️ Tech Stack

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

### Core Technologies

- **[Astro.js](https://astro.build/)** `^5.14.3` - Modern static site generator
- **[Tailwind CSS](https://tailwindcss.com/)** `^3.4.18` - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript superset
- **[Ollama](https://ollama.ai/)** `^0.6.0` - Local large language model runtime
- **[Express.js](https://expressjs.com/)** `^5.1.0` - Fast, minimalist web framework
- **[React](https://react.dev/)** `^19.0.0` - UI component library
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI

### Development Tools

- **@astrojs/check** - Astro project type checking
- **@astrojs/react** - Astro React integration
- **@astrojs/tailwind** - Astro Tailwind CSS integration
- **tsx** - TypeScript execution environment
- **nodemon** - Auto-restart on file changes
- **Vite** - Fast frontend build tool (built into Astro)

## 📊 Project Status

- ✅ Basic architecture completed
- ✅ Ollama API integration completed
- ✅ Chat interface development completed
- ✅ Responsive design completed
- ✅ Error handling completed
- ✅ TypeScript support completed
- ✅ Streaming response support completed
- ✅ Express.js API server completed
- ✅ React + shadcn/ui integration completed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open **Pull Request**

### Development Guidelines

- Write code in TypeScript
- Follow ESLint and Prettier rules
- Add appropriate comments and documentation
- Ensure all tests pass

## 📄 License

This project is licensed under the **MIT** License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Astro Team](https://astro.build/team/) - Excellent static site generator
- [Tailwind Labs](https://tailwindlabs.com/) - Elegant CSS framework
- [Ollama Community](https://ollama.ai/) - Making local AI simple
- All open-source contributors ❤️

---

<div align="center">

**[⭐ Star Us](https://github.com/yourusername/templ)** • **[🐛 Report Issues](https://github.com/yourusername/templ/issues)** • **[💡 Feature Requests](https://github.com/yourusername/templ/issues)**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
