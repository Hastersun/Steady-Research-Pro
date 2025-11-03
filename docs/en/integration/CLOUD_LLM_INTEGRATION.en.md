# Cloud LLM Provider Integration Guide

## Overview

This project now supports multiple cloud and local LLM providers, including:

- **OpenAI** (GPT-4, GPT-3.5-turbo, etc.)
- **Anthropic Claude** (Claude 3 Opus, Sonnet, Haiku, etc.)
- **Google Gemini** (Gemini Pro, Ultra, etc.)
- **Ollama** (Local deployment)
- **OpenLLM** (Local deployment, OpenAI API compatible)

## Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API Keys:

```bash
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Ollama (Local)
OLLAMA_HOST=http://localhost:11434
```

### 2. API Usage

#### Non-Streaming Requests

```bash
# Using OpenAI
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, please introduce yourself",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'

# Using Anthropic Claude
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing basics",
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229"
  }'

# Using Google Gemini
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a quicksort implementation in Python",
    "provider": "google",
    "model": "gemini-pro"
  }'

# Using Ollama (default)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "provider": "ollama",
    "model": "llama2"
  }'
```

#### Streaming Requests (Server-Sent Events)

```bash
# Streaming response example
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a short essay about space exploration",
    "provider": "openai",
    "model": "gpt-4"
  }'
```

#### Query Available Providers

```bash
# Get all provider status and available models
curl http://localhost:3000/api/chat/providers
```

Example response:

```json
{
  "success": true,
  "providers": [
    {
      "name": "openai",
      "available": true,
      "models": ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"]
    },
    {
      "name": "anthropic",
      "available": true,
      "models": ["claude-3-opus-20240229", "claude-3-sonnet-20240229"]
    },
    {
      "name": "google",
      "available": false,
      "models": []
    },
    {
      "name": "ollama",
      "available": true,
      "models": ["llama2", "codellama", "mistral"]
    }
  ],
  "default": "ollama"
}
```

### 3. JavaScript/TypeScript Client Examples

```typescript
// Non-streaming request
async function sendMessage(message: string, provider: string = 'openai', model?: string) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      provider,
      model
    })
  });
  
  const result = await response.json();
  console.log(result.data);
  return result;
}

// Streaming request
async function sendStreamingMessage(message: string, provider: string = 'openai', model?: string) {
  const response = await fetch('http://localhost:3000/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      provider,
      model
    })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

    for (const line of lines) {
      const data = line.replace(/^data: /, '').trim();
      if (data === '[DONE]') {
        console.log('Stream completed');
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (parsed.content) {
          process.stdout.write(parsed.content); // Output character by character
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}

// Usage examples
await sendMessage('Hello, introduce yourself', 'openai', 'gpt-3.5-turbo');
await sendStreamingMessage('Write a Fibonacci sequence implementation', 'anthropic', 'claude-3-sonnet-20240229');
```

### 4. React Component Integration Example

```tsx
import { useState } from 'react';

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [provider, setProvider] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          provider
        })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data: /, '').trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              setResponse(prev => prev + parsed.content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic Claude</option>
          <option value="google">Google Gemini</option>
          <option value="ollama">Ollama (Local)</option>
        </select>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div>{response}</div>
    </div>
  );
}
```

## Supported Models

### OpenAI
- `gpt-4-turbo-preview` - Latest GPT-4 Turbo model
- `gpt-4` - Base GPT-4 model
- `gpt-3.5-turbo` - Fast and economical model
- `gpt-3.5-turbo-16k` - 16K context window version

### Anthropic Claude
- `claude-3-opus-20240229` - Most powerful Claude 3 model
- `claude-3-sonnet-20240229` - Balance of performance and speed
- `claude-3-haiku-20240307` - Fastest Claude 3 model
- `claude-2.1` - Claude 2.1 version
- `claude-2.0` - Claude 2.0 version

### Google Gemini
- `gemini-pro` - Standard Gemini model
- `gemini-pro-vision` - Supports image input
- `gemini-ultra` - Most powerful Gemini model

### Ollama (Local)
- `llama2` - Meta's open-source LLM
- `codellama` - Specialized for code generation
- `mistral` - Mistral AI's open-source model
- More models at [Ollama Library](https://ollama.ai/library)

## Configuration Parameters

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | Yes | - | User message content |
| `provider` | string | No | `ollama` | LLM provider (`openai`, `anthropic`, `google`, `ollama`, `openllm`) |
| `model` | string | No | Provider default | Specific model to use |

### Response Format

#### Non-Streaming Response

```json
{
  "success": true,
  "data": "AI response content...",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

#### Streaming Response (Server-Sent Events)

```
data: {"content": "Hello"}

data: {"content": " world"}

data: {"content": "!"}

data: [DONE]
```

## Error Handling

All APIs return the following format on error:

```json
{
  "success": false,
  "error": "Error message description",
  "model": "Model used",
  "provider": "Provider used"
}
```

Common errors:

- `API key is missing for the selected provider` - Missing API Key
- `{provider} service is unavailable` - Service unavailable
- `Message content cannot be empty` - Empty message content
- `Invalid provider` - Unsupported provider

## Best Practices

1. **API Key Security**
   - Never expose API Keys in client-side code
   - Store sensitive information in environment variables
   - Use proper access controls in production

2. **Cost Control**
   - Cloud providers charge by token, monitor usage
   - Use local Ollama for development and testing
   - Set reasonable `max_tokens` limits

3. **Performance Optimization**
   - Streaming responses provide better UX
   - Choose appropriate models for use cases
   - Use caching to reduce duplicate requests

4. **Error Handling**
   - Always handle API errors
   - Implement retry mechanisms
   - Provide fallback options (e.g., GPT-4 → GPT-3.5)

## Troubleshooting

### OpenAI Connection Failed
- Check if API Key is correct
- Confirm account has sufficient balance
- Check network connection and firewall settings

### Anthropic Connection Failed
- Verify API Key format (should start with `sk-ant-`)
- Check account status and quota

### Google Gemini Connection Failed
- Confirm API Key has Gemini API enabled
- Check region restrictions

### Ollama Connection Failed
- Ensure Ollama service is running: `ollama serve`
- Verify port 11434 is not occupied
- Check if model is downloaded: `ollama list`

## Advanced Configuration

### Custom Generation Parameters

Adjust default parameters for each provider in `src/lib/config.ts`:

```typescript
export const OPENAI_CONFIG = {
  // ...
  GENERATION_CONFIG: {
    temperature: 0.7,    // Creativity (0-2)
    max_tokens: 2048,    // Max output length
    top_p: 1,            // Nucleus sampling
    frequency_penalty: 0, // Frequency penalty
    presence_penalty: 0,  // Presence penalty
  },
};
```

### Adding New Providers

1. Add configuration in `src/lib/config.ts`
2. Implement `ILLMProvider` interface in `src/lib/llm-providers.ts`
3. Register in `createLLMProvider` factory function

## Licensing and Limits

- OpenAI: Token-based billing, see [Pricing](https://openai.com/pricing)
- Anthropic: Token-based billing, see [Pricing](https://www.anthropic.com/pricing)
- Google Gemini: Free tier available, see [Pricing](https://ai.google.dev/pricing)
- Ollama: Completely free, runs locally

## Related Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Ollama Documentation](https://ollama.ai/docs)
