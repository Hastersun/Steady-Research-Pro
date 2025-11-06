# Chat Completions API

## OpenAI-Compatible Chat Completions API

This API endpoint provides an interface compatible with the OpenAI Chat Completions API and can seamlessly replace the OpenAI API.

## Endpoint

```
POST /api/v1/chat/completions
```

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Default | Description |
|------|------|------|--------|------|
| `messages` | array | Yes | - | List of messages |
| `model` | string | No | llama2 | Model name to use |
| `temperature` | number | No | 0.7 | Controls randomness (0-2) |
| `max_tokens` | number | No | - | Maximum tokens to generate |
| `stream` | boolean | No | false | Whether to stream response (not supported yet) |
| `top_p` | number | No | - | Nucleus sampling parameter |
| `n` | number | No | 1 | Number of responses to generate |
| `user` | string | No | - | User identifier |

### Messages Format

```typescript
{
  "messages": [
    {
      "role": "system" | "user" | "assistant",
      "content": string
    }
  ]
}
```

## Response Format

### Success Response (200)

```json
{
  "id": "chatcmpl-1699234567890",
  "object": "chat.completion",
  "created": 1699234567,
  "model": "llama2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "AI response content"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": -1,
    "completion_tokens": -1,
    "total_tokens": -1
  }
}
```

### Error Response

```json
{
  "error": {
    "message": "Error description",
    "type": "Error type",
    "code": "Error code"
  }
}
```

#### Error Types

- `service_unavailable` (503) - Ollama service unavailable
- `invalid_request_error` (400) - Invalid request parameters
- `not_implemented` (501) - Feature not implemented
- `api_error` (500) - API error
- `internal_error` (500) - Internal server error

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:4321/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful AI assistant."
      },
      {
        "role": "user",
        "content": "What is artificial intelligence?"
      }
    ],
    "model": "llama2",
    "temperature": 0.7
  }'
```

### JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:4321/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant.'
      },
      {
        role: 'user',
        content: 'What is artificial intelligence?'
      }
    ],
    model: 'llama2',
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:4321/api/v1/chat/completions',
    json={
        'messages': [
            {
                'role': 'system',
                'content': 'You are a helpful AI assistant.'
            },
            {
                'role': 'user',
                'content': 'What is artificial intelligence?'
            }
        ],
        'model': 'llama2',
        'temperature': 0.7
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

### Using OpenAI SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'not-needed', // Ollama doesn't require API key
  baseURL: 'http://localhost:4321/api/v1'
});

const completion = await openai.chat.completions.create({
  messages: [
    {
      role: 'system',
      content: 'You are a helpful AI assistant.'
    },
    {
      role: 'user',
      content: 'What is artificial intelligence?'
    }
  ],
  model: 'llama2',
  temperature: 0.7
});

console.log(completion.choices[0].message.content);
```

## Compatibility with OpenAI API

### Supported Features
- ✅ Standard message format (system/user/assistant)
- ✅ Model selection
- ✅ Temperature parameter
- ✅ Error handling
- ✅ CORS support

### Unsupported Features
- ❌ Streaming responses (stream)
- ❌ Token counting (usage fields return -1)
- ❌ Multiple responses (n > 1)
- ❌ Function calling
- ❌ Stop sequences (stop)

### Differences

1. **Token Counting**: Ollama doesn't provide token counts, all `usage` field values are -1
2. **Streaming**: Current version doesn't support streaming, use `/api/chat/stream` instead
3. **Model Names**: Use Ollama-supported model names (e.g., llama2, mistral, codellama)

## Configuration

### Environment Variables

```bash
# .env
OLLAMA_HOST=http://localhost:11434
```

### Supported Models

Depends on models installed in your Ollama:
- llama2
- llama3
- mistral
- codellama
- phi
- Other Ollama-supported models

View available models:
```bash
ollama list
```

## Error Handling

### Common Errors

#### 1. Ollama Service Unavailable
```json
{
  "error": {
    "message": "Ollama service is unavailable. Please make sure Ollama is running.",
    "type": "service_unavailable",
    "code": "ollama_unavailable"
  }
}
```

**Solution**: Start Ollama service
```bash
ollama serve
```

#### 2. Invalid Message Format
```json
{
  "error": {
    "message": "Messages must be a non-empty array",
    "type": "invalid_request_error",
    "code": "invalid_messages"
  }
}
```

**Solution**: Ensure `messages` is a non-empty array with each message having `role` and `content` fields

#### 3. Model Not Found
```json
{
  "error": {
    "message": "Failed to generate response",
    "type": "api_error",
    "code": "generation_failed"
  }
}
```

**Solution**: Confirm model is installed
```bash
ollama pull llama2
```

## Performance Optimization

### Recommendations
1. Use smaller models for faster responses
2. Adjust `temperature` and `max_tokens` to balance quality and speed
3. Consider implementing caching mechanisms
4. For production, use dedicated GPU servers

### Benchmarks

| Model | Avg Response Time | Memory Usage |
|------|------------|---------|
| llama2 | ~2-5s | ~4GB |
| mistral | ~1-3s | ~4GB |
| phi | ~1-2s | ~2GB |

*Actual performance depends on hardware configuration*

## Security

### CORS
API allows all origins by default (`Access-Control-Allow-Origin: *`). Should be restricted to specific domains in production.

### Rate Limiting
Current version doesn't implement rate limiting. Recommended to add in production.

### Authentication
Current version doesn't require authentication. If needed, check `Authorization` header in requests.

## Future Development

Planned features:
- [ ] Streaming response support
- [ ] Token counting
- [ ] Function calling
- [ ] Rate limiting
- [ ] API key authentication
- [ ] Request logging and monitoring
- [ ] Caching mechanism
- [ ] Parallel multi-model requests

## Related Documentation

- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Project API Documentation](../../../EXPRESS_INTEGRATION_SUMMARY.md)
