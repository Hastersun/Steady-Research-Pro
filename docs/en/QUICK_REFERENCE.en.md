# Cloud LLM Provider Quick Reference

## 🚀 5-Minute Quick Start

### 1. Add API Key
```bash
# Edit .env file
OPENAI_API_KEY=sk-your-key-here
```

### 2. Start Service
```bash
npm run server:dev
```

### 3. Test Request
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","provider":"openai"}'
```

## 📡 API Endpoints

| Endpoint | Method | Function |
|------|------|------|
| `/api/chat` | POST | Send message (non-streaming) |
| `/api/chat/stream` | POST | Send message (streaming) |
| `/api/chat/providers` | GET | Query provider status |

## 🎯 Request Parameters

```typescript
{
  message: string,      // Required - User message
  provider?: string,    // Optional - 'openai'|'anthropic'|'google'|'ollama'
  model?: string        // Optional - Specific model name
}
```

## 🤖 Supported Providers

### OpenAI
```bash
provider: "openai"
models: ["gpt-4", "gpt-3.5-turbo"]
```

### Anthropic Claude
```bash
provider: "anthropic"
models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229"]
```

### Google Gemini
```bash
provider: "google"
models: ["gemini-pro", "gemini-ultra"]
```

### Ollama (Local)
```bash
provider: "ollama"
models: ["llama2", "mistral", "codellama"]
```

## 💻 Code Examples

### JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello',
    provider: 'openai',
    model: 'gpt-3.5-turbo'
  })
});

const result = await response.json();
console.log(result.data);
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/chat', json={
    'message': 'Hello',
    'provider': 'openai',
    'model': 'gpt-3.5-turbo'
})

print(response.json()['data'])
```

### cURL
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","provider":"openai","model":"gpt-3.5-turbo"}'
```

## 🔄 Streaming Response

```typescript
const response = await fetch('http://localhost:3000/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Write a story',
    provider: 'openai'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));
  
  for (const line of lines) {
    const data = line.replace(/^data: /, '').trim();
    if (data === '[DONE]') break;
    
    try {
      const parsed = JSON.parse(data);
      process.stdout.write(parsed.content);
    } catch {}
  }
}
```

## 🔐 Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google
GOOGLE_API_KEY=AIzaSy...

# Ollama (Local)
OLLAMA_HOST=http://localhost:11434
```

## ⚠️ Common Errors

| Error | Cause | Solution |
|------|------|----------|
| `API key is missing` | API Key not configured | Add corresponding API Key in `.env` |
| `Service unavailable` | Service unavailable | Check if API Key is valid and network is accessible |
| `Message cannot be empty` | Empty message | Ensure `message` field is not empty |
| `Invalid provider` | Provider doesn't exist | Use supported provider names |

## 📊 Response Format

### Success
```json
{
  "success": true,
  "data": "AI response content...",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

### Failure
```json
{
  "success": false,
  "error": "Error description",
  "model": "Model name",
  "provider": "Provider name"
}
```

## 🎨 Model Selection Guide

### Performance Priority
- OpenAI: `gpt-4-turbo-preview`
- Anthropic: `claude-3-opus-20240229`
- Google: `gemini-ultra`

### Speed Priority
- OpenAI: `gpt-3.5-turbo`
- Anthropic: `claude-3-haiku-20240307`
- Google: `gemini-pro`

### Cost Priority
- OpenAI: `gpt-3.5-turbo`
- Ollama: All models (free)

### Privacy Priority
- Ollama: Local deployment (complete privacy)

## 🔗 Related Links

- [Complete Documentation](./CLOUD_LLM_INTEGRATION.md)
- [Quick Test](../testing/CLOUD_LLM_QUICK_TEST.md)
- [Integration Summary](./CLOUD_LLM_INTEGRATION_SUMMARY.md)

## 📈 Performance Reference

| Provider | Avg Latency | Throughput | Cost |
|--------|----------|--------|------|
| OpenAI GPT-3.5 | ~500ms | High | Low |
| OpenAI GPT-4 | ~2s | Medium | High |
| Anthropic Claude | ~1s | Medium | Medium |
| Google Gemini | ~1s | Medium | Low |
| Ollama | ~3s | Low | Free |

## 💡 Best Practices

1. **Development**: Use local Ollama or GPT-3.5-turbo
2. **Testing**: Use Claude Haiku or Gemini Pro
3. **Production**: Choose appropriate model based on needs
4. **Cost Control**: Set `max_tokens` limits
5. **Error Handling**: Implement retry mechanism and fallback strategies

---

**Note**: All examples assume the server is running on `http://localhost:3000`
