# Quick Start Guide

Get Steady Research Pro up and running in 5 minutes! ⚡

## Prerequisites Check

Before starting, ensure you have:

- ✅ **Node.js 16+** - [Download](https://nodejs.org/)
- ✅ **npm or yarn** - Comes with Node.js
- ✅ **Git** - [Download](https://git-scm.com/)

Check your versions:
```bash
node --version  # Should be v16.0.0 or higher
npm --version   # Should be 7.0.0 or higher
```

## Installation (3 Steps)

### Step 1: Clone & Enter

```bash
git clone https://github.com/Hastersun/Steady-Research-Pro.git
cd Steady-Research-Pro
```

### Step 2: Install Dependencies

```bash
npm install
```

This will take 1-2 minutes depending on your internet speed.

### Step 3: Start the App

```bash
npm run dev
```

You should see:
```
🚀 astro v5.14.8 started in XXms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

## First Use

### Open the Application

1. Open your browser
2. Go to `http://localhost:4321`
3. You should see the Steady Research Pro interface!

### Choose Your AI Service

You have two options:

#### Option A: Use Local Ollama (Recommended for Beginners)

**Why?** It's free, private, and works offline!

1. **Install Ollama**
   - Visit [ollama.ai](https://ollama.ai/)
   - Download for your OS (Windows/Mac/Linux)
   - Install and run

2. **Pull a Model**
   ```bash
   ollama pull llama2
   ```
   
3. **Verify Installation**
   ```bash
   ollama list
   ```
   You should see `llama2` in the list

4. **In the App**
   - Select "Local Ollama" from AI Service dropdown
   - Click "Test Connection"
   - Status should show "Connected" ✅

#### Option B: Use Cloud AI Service

**Why?** Faster responses, no local setup required

1. **Get an API Key**
   - For OpenAI: [platform.openai.com](https://platform.openai.com/)
   - For DeepSeek: [platform.deepseek.com](https://platform.deepseek.com/)
   - For Claude: [console.anthropic.com](https://console.anthropic.com/)

2. **In the App**
   - Select your AI service from dropdown
   - Enter your API key
   - Click "Test Connection"

## Your First Research

Let's do a quick test!

1. **Enter a Topic**
   ```
   Example: "The history of artificial intelligence"
   ```

2. **Configure Settings** (or use defaults)
   - Depth: Quick
   - AI Service: Your chosen service
   - Search Engines: Bing (if configured)

3. **Start Research**
   - Click "Start Research" button
   - Watch the progress bars
   - See results appear in real-time!

4. **Review Results**
   - Read the generated report
   - Check sources and citations
   - Explore the research plan

## Common Issues & Solutions

### Issue: "Port 4321 is already in use"

**Solution:**
```bash
# Stop the process using port 4321
lsof -ti:4321 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :4321   # Windows (note the PID and use Task Manager)

# Or use a different port
npm run dev -- --port 3000
```

### Issue: "Ollama connection failed"

**Solutions:**
1. Check if Ollama is running
2. Try restarting Ollama
3. Verify URL is `http://localhost:11434`
4. Check firewall settings

### Issue: "npm install fails"

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Search not working"

**Note:** Search requires API keys for Bing or Google Search APIs
- These are optional for basic AI chat functionality
- See [SEARCH_API_SETUP.md](SEARCH_API_SETUP.md) for configuration

## Next Steps

Now that you're up and running:

1. **📚 Read the Docs**
   - [Full README](README.md)
   - [Feature Details](FEATURES.md)
   - [FAQ](FAQ.md)

2. **🔧 Configure Advanced Settings**
   - Set up search engines
   - Try different AI models
   - Adjust research depth

3. **🤝 Get Involved**
   - Star the repo ⭐
   - Report issues
   - Contribute code
   - Share feedback

## Video Tutorial

*Coming soon!* We're working on video tutorials to make this even easier.

## Getting Help

Need assistance?

- 📖 Check the [FAQ](FAQ.md)
- 🐛 [Report an issue](https://github.com/Hastersun/Steady-Research-Pro/issues)
- 💬 [Ask in discussions](https://github.com/Hastersun/Steady-Research-Pro/discussions)

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run linter
npm run format       # Format code
npm test             # Run tests

# Ollama
ollama pull llama2   # Download a model
ollama list          # List installed models
ollama run llama2    # Test a model
```

---

**🎉 Congratulations!** You're now ready to use Steady Research Pro!

If you find this useful, please give us a ⭐ on GitHub!
