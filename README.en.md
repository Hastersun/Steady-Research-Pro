# 🔬 Steady Research Pro

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/Astro-5.14.8-FF5D01?logo=astro)](https://astro.build/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**An AI-powered research assistant that makes deep research simple and efficient**

English | [简体中文](README.md)

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 📖 About

Steady Research Pro is a modern intelligent research assistant platform built with **Astro + Tailwind CSS + Ollama**. It combines AI large language models with multi-source information retrieval to provide an all-in-one deep research solution for researchers, students, and content creators.

### 🌟 Why Choose Steady Research Pro?

- 🤖 **Multiple AI Services** - Support for local Ollama, OpenAI, DeepSeek, Claude, Google Gemini, and more
- 🔍 **Intelligent Multi-Source Search** - Integrate Bing and Google Search APIs with automatic aggregation and deduplication
- 📊 **Visual Progress Tracking** - Real-time display of research progress and reasoning traces
- 🎨 **Elegant User Interface** - Modern responsive design based on Tailwind CSS
- 🔄 **Streaming Data Processing** - Support for real-time streaming responses for smooth interactions
- 🌐 **Fully Open Source** - ISC license, free to use and modify

## What’s Fixed

## 💡 Key Advantages

### 🆓 Completely Free
- Open-source code, free to use and modify
- Support for local Ollama models, no API fees
- Optional cloud AI services for flexibility

### 🔒 Privacy & Security
- Local operation mode, data stays on your device
- API keys stored locally
- Full control over data security

### ⚡ High Performance
- Astro static generation for ultra-fast loading
- Streaming responses with real-time feedback
- Optimized search aggregation algorithms

### 🎨 User-Friendly
- Intuitive user interface
- Real-time progress visualization
- Responsive design for all devices

## ✨ Features

### Core Capabilities

- 🧠 **Intelligent Research Planning** - AI automatically analyzes research topics and generates structured plans
- 🔍 **Multi-Source Search & Aggregation** - Search multiple engines simultaneously with smart deduplication and ranking
- 📈 **Real-Time Progress Tracking** - Visual display of research stages, progress, and status
- 🔬 **Reasoning Trace Display** - Transparent view of AI's thought process and reasoning chain
- 💬 **Multiple AI Model Support** - Flexible switching between different AI services and models

### Technical Highlights

- ⚡ **Astro Static Generation** - Fast loading with excellent SEO performance
- 🎨 **Tailwind CSS** - Modern responsive UI design
- 🤖 **Ollama Integration** - Support for locally deployed open-source AI models
- 🌊 **Streaming Responses** - Server-Sent Events for smooth data streaming
- 📱 **Mobile-Friendly** - Fully responsive design for all screen sizes
- 🔒 **Privacy Protection** - Local operation mode keeps data on your device

## 📁 Project Structure

```
Steady-Research-Pro/
├── src/
│   ├── components/          # Astro components
│   │   ├── ResearchAgentUI.astro      # Main research interface
│   │   ├── OllamaPanel.astro          # AI service control panel
│   │   ├── AIServiceSelector.astro    # AI service selector
│   │   └── agent/                     # Research agent components
│   │       ├── SidePanel.astro        # Configuration sidebar
│   │       └── ResultsGrid.astro      # Results display grid
│   ├── lib/                 # Utility libraries
│   │   ├── ollama-client.js           # Ollama client
│   │   ├── http-api.js                # HTTP API client
│   │   ├── search-api-client.js       # Search API client
│   │   └── research-processor.js      # Research flow processor
│   ├── pages/               # Pages and API routes
│   │   ├── index.astro                # Home page
│   │   └── api/                       # API endpoints
│   │       ├── ollama.js              # Ollama API
│   │       ├── http-api.js            # HTTP LLM API
│   │       ├── research.js            # Research API
│   │       └── search.js              # Search API
│   └── styles/
│       └── global.css                 # Global styles
├── docs/                    # Documentation
│   ├── API.md                         # API documentation
│   └── agents-protocol.md             # Agent protocol docs
├── tests/                   # Test files
└── public/                  # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn**
- **Ollama** (optional, for local AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hastersun/Steady-Research-Pro.git
   cd Steady-Research-Pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   
   Visit `http://localhost:4321` in your browser

### Configure AI Services

#### Using Local Ollama (Recommended for beginners)

1. Install [Ollama](https://ollama.ai/)
2. Pull a model: `ollama pull llama2`
3. Start the Ollama service
4. Select "Local Ollama" in the application

#### Using Cloud AI Services

Configure your API keys in the AI service selector:
- OpenAI
- DeepSeek
- Claude (Anthropic)
- Google Gemini

For detailed configuration, see [AI Service Configuration](AI_SERVICE_SELECTOR_README.md)

### Available Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## 📖 Documentation

- [API Documentation](docs/API.md) - Complete REST API reference
- [AI Service Configuration](AI_SERVICE_SELECTOR_README.md) - Multi-AI service setup guide
- [Search Engine Setup](SEARCH_API_SETUP.md) - Bing and Google Search API configuration
- [Agent Protocol](docs/agents-protocol.md) - Research agent communication protocol

## 🎯 Use Cases

### Target Users

- 📚 **Academic Researchers** - Quickly gather and organize research materials
- ✍️ **Content Creators** - Deep research for writing materials
- 👨‍💼 **Business Analysts** - Market research and competitor analysis
- 🎓 **Students** - Topic research and essay writing
- 💡 **Product Managers** - User research and industry trend analysis

### Typical Applications

- Literature reviews for academic papers
- Technology trend research reports
- Market analysis and competitive research
- In-depth news event analysis
- Knowledge base construction and organization

## 🤝 Contributing

We welcome all forms of contributions! Whether it's reporting bugs, suggesting new features, or submitting code improvements.

### How to Contribute

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

This project is licensed under the [ISC License](LICENSE).

## 🙏 Acknowledgments

Thanks to the following open-source projects and services:

- [Astro](https://astro.build/) - Modern static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Ollama](https://ollama.ai/) - Run large language models locally
- [HyperUI](https://www.hyperui.dev/) - Tailwind CSS component library

## 💬 Contact & Support

- 🐛 [Report a Bug](https://github.com/Hastersun/Steady-Research-Pro/issues)
- 💡 [Request a Feature](https://github.com/Hastersun/Steady-Research-Pro/issues)
- ⭐ If this project helps you, please give us a Star!

---

<div align="center">

**If you find this project helpful, please ⭐Star us!**

Made with ❤️ by [Hastersun](https://github.com/Hastersun)

</div>
