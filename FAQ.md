# Frequently Asked Questions (FAQ)

## General Questions

### What is Steady Research Pro?

Steady Research Pro is an AI-powered research assistant that combines large language models with multi-source web search to help you conduct deep research efficiently. It automates the research process from planning to report generation.

### Is it free to use?

Yes! The software is completely free and open-source under the ISC license. However:
- Using local Ollama models is completely free
- Cloud AI services (OpenAI, DeepSeek, Claude, Gemini) require your own API keys and may have costs

### Do I need technical knowledge to use it?

No! The interface is designed to be user-friendly. Basic steps:
1. Install Node.js
2. Clone the repository
3. Run `npm install` and `npm run dev`
4. Open in your browser

## Setup & Installation

### What are the system requirements?

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 16 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 500MB for application + space for Ollama models (if used)

### How do I install Ollama?

1. Visit [ollama.ai](https://ollama.ai/)
2. Download the installer for your OS
3. Run the installer
4. Pull a model: `ollama pull llama2`
5. Verify: `ollama list`

### Can I use it without Ollama?

Yes! You can use cloud AI services like OpenAI, DeepSeek, Claude, or Google Gemini by providing your API keys.

### How do I get API keys for cloud services?

- **OpenAI**: [platform.openai.com](https://platform.openai.com/)
- **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com/)
- **Claude**: [console.anthropic.com](https://console.anthropic.com/)
- **Google Gemini**: [ai.google.dev](https://ai.google.dev/)

## Features

### What AI models are supported?

**Local (via Ollama):**
- Llama 2/3
- Mistral
- Phi
- And 50+ other models

**Cloud Services:**
- OpenAI (GPT-3.5, GPT-4)
- DeepSeek (deepseek-chat, deepseek-coder)
- Claude (Claude 3 Opus, Sonnet, Haiku)
- Google Gemini (Gemini Pro, Gemini Pro Vision)

### How does the search feature work?

The application can integrate with:
- **Bing Web Search API** - Microsoft's search service
- **Google Custom Search API** - Google's search with customization

You need to provide API keys for these services. See [SEARCH_API_SETUP.md](SEARCH_API_SETUP.md) for details.

### Can it work offline?

Partially. With local Ollama:
- ✅ AI chat and generation works offline
- ❌ Web search requires internet connection
- ✅ Application UI works offline after initial load

## Usage

### How do I conduct a research?

1. Enter your research topic
2. Configure depth level and options
3. Select AI service and search engines
4. Click "Start Research"
5. Monitor real-time progress
6. Review the generated report

### What depth levels mean?

- **Quick**: Fast overview (1-2 minutes)
- **Standard**: Balanced depth (3-5 minutes)
- **Deep**: Comprehensive analysis (10-15 minutes)
- **Expert**: Maximum depth (20+ minutes)

### Can I interrupt a research?

Yes, you can stop research at any time. The results up to that point will be available.

### How are results organized?

Results include:
- Research plan outline
- Gathered information by topic
- Source citations
- Summary and key findings
- Recommendations

## Privacy & Security

### Where is my data stored?

- **Application data**: On your computer
- **API keys**: In browser's localStorage
- **Research history**: In browser storage (optional)
- **Cloud AI usage**: Data sent to respective AI providers

### Are API keys secure?

API keys are stored in your browser's local storage. They never leave your device except when making API calls to the respective services.

### What data is sent to AI services?

Only:
- Your research queries
- Generated prompts for AI
- Search results for analysis

Not sent:
- Your API keys to other services
- Your browsing history
- Other personal information

### Can I use it for confidential research?

For sensitive topics, we recommend:
- Use local Ollama instead of cloud services
- Review the privacy policies of any third-party services
- Consider running the application in a secure environment

## Troubleshooting

### Ollama connection failed

**Possible solutions:**
1. Ensure Ollama is running: Check if the Ollama app is active
2. Verify the URL: Default is `http://localhost:11434`
3. Test connection: Try `ollama list` in terminal
4. Check firewall: Ensure port 11434 is not blocked

### Search not working

**Check:**
1. API keys are correctly entered
2. API keys have sufficient quota
3. Search engines are selected
4. Internet connection is active

### Application won't start

**Try:**
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Update Node.js to latest LTS version
3. Check for port conflicts (default: 4321)
4. Review error messages in terminal

### Build errors

**Common fixes:**
1. Update dependencies: `npm update`
2. Clear cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules package-lock.json && npm install`

## Performance

### Why is it slow?

Possible reasons:
- AI model generating response (normal)
- Large number of search results
- Slow internet connection
- Resource-intensive Ollama model

**Optimizations:**
- Use faster models (e.g., llama2:7b vs llama2:70b)
- Reduce search result count
- Lower depth level
- Use cloud AI for faster responses

### How much RAM does it need?

- **Application**: 100-200 MB
- **Browser**: 200-500 MB
- **Ollama (if used)**: 2-8 GB depending on model
- **Total recommended**: 8 GB or more

## Development

### How can I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines. Quick start:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### How do I report bugs?

1. Check if the issue already exists
2. Use the bug report template
3. Provide detailed information
4. Include steps to reproduce

### Can I customize the prompts?

Yes! The prompts are in the source code and can be modified. Look for prompt templates in the `src/lib/` directory.

### Is there an API?

Yes! See [docs/API.md](docs/API.md) for complete API documentation. The REST API allows you to:
- Trigger research programmatically
- Access search functionality
- Integrate with other applications

## Licensing

### Can I use it commercially?

Yes! The ISC license allows commercial use, modification, and distribution.

### Can I modify and redistribute?

Yes, as long as you include the original copyright notice and license.

### Do I need to open-source my modifications?

No, the ISC license does not require you to share your changes (unlike GPL).

## Support

### Where can I get help?

- 📖 Read the [documentation](README.md)
- 🐛 [Report issues](https://github.com/Hastersun/Steady-Research-Pro/issues)
- 💬 [Start a discussion](https://github.com/Hastersun/Steady-Research-Pro/discussions)
- 📧 Contact maintainers via GitHub

### How often is it updated?

The project is actively maintained with regular updates for:
- Bug fixes
- New features
- Security patches
- Documentation improvements

### Can I request features?

Absolutely! Use the feature request template in GitHub Issues. We welcome all suggestions.

## Comparisons

### How is it different from ChatGPT?

| Feature | Steady Research Pro | ChatGPT |
|---------|-------------------|---------|
| Multi-source search | ✅ | Limited |
| Local/offline mode | ✅ | ❌ |
| Multiple AI services | ✅ | ❌ |
| Structured research | ✅ | Manual |
| Source tracking | ✅ | Limited |
| Open source | ✅ | ❌ |
| Cost | Free/BYOK | Subscription |

### How is it different from Perplexity?

Steady Research Pro offers:
- Local deployment option
- Choice of AI services
- Open-source and customizable
- No subscription required
- More control over research process

---

## Still have questions?

Feel free to:
- 📬 [Open an issue](https://github.com/Hastersun/Steady-Research-Pro/issues)
- 💬 [Start a discussion](https://github.com/Hastersun/Steady-Research-Pro/discussions)
- ⭐ Star the project if you find it useful!
