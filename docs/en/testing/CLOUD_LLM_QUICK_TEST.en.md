# Cloud LLM Provider Quick Test Guide

## Test Preparation

### 1. Configure Environment Variables

Add at least one cloud provider's API Key to the `.env` file:

```bash
# Choose the provider you want to test
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_API_KEY=AIzaSy...
```

### 2. Start Servers

```bash
# Terminal 1: Start Express API server
npm run server:dev

# Terminal 2 (optional): Start Astro dev server
npm run dev
```

## Quick Test Commands

### Test 1: Check All Provider Status

```bash
curl http://localhost:3000/api/chat/providers
```

Expected output: Shows availability and supported model lists for all providers.

### Test 2: OpenAI Non-streaming Request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing in one sentence",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'
```

### Test 3: OpenAI Streaming Request

```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a Python implementation of Fibonacci sequence",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'
```

### Test 4: Anthropic Claude Request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain what machine learning is",
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229"
  }'
```

### Test 5: Google Gemini Request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is deep learning?",
    "provider": "google",
    "model": "gemini-pro"
  }'
```

### Test 6: Ollama Local Request (Start Ollama first)

```bash
# Ensure Ollama is running
ollama serve

# Test request
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "provider": "ollama",
    "model": "llama2"
  }'
```

## Testing with PowerShell (Windows)

### Test Provider Status

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat/providers" -Method Get | ConvertTo-Json -Depth 5
```

### OpenAI Test

```powershell
$body = @{
    message = "Introduce artificial intelligence"
    provider = "openai"
    model = "gpt-3.5-turbo"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 5
```

### Anthropic Test

```powershell
$body = @{
    message = "What is a neural network?"
    provider = "anthropic"
    model = "claude-3-sonnet-20240229"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 5
```

## Testing with JavaScript

Create test file `test-llm.js`:

```javascript
const providers = [
  { name: 'openai', model: 'gpt-3.5-turbo' },
  { name: 'anthropic', model: 'claude-3-sonnet-20240229' },
  { name: 'google', model: 'gemini-pro' },
  { name: 'ollama', model: 'llama2' }
];

async function testProvider(provider, model) {
  console.log(`\nTesting ${provider} (${model})...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Hello from ${provider}! Please respond with your name.`,
        provider,
        model
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✓ ${provider} success!`);
      console.log(`Response: ${result.data.substring(0, 100)}...`);
    } else {
      console.log(`✗ ${provider} failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`✗ ${provider} error: ${error.message}`);
  }
}

async function runTests() {
  console.log('Starting tests for all LLM providers...\n');
  
  for (const { name, model } of providers) {
    await testProvider(name, model);
    // Wait 1 second to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\nTests complete!');
}

runTests();
```

Run tests:

```bash
node test-llm.js
```

## Expected Results

### Success Response Example

```json
{
  "success": true,
  "data": "I am GPT-3.5, a large language model developed by OpenAI...",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

### Failure Response Example

```json
{
  "success": false,
  "error": "API key is missing for the selected provider",
  "model": "gpt-3.5-turbo",
  "provider": "openai"
}
```

## Common Issue Troubleshooting

### 1. Connection Refused

**Issue**: `ECONNREFUSED` error

**Solution**:
- Ensure Express server is running: `npm run server:dev`
- Check if port 3000 is already in use

### 2. API Key Error

**Issue**: `API key is missing` or `Invalid API key`

**Solution**:
- Check if API Key in `.env` file is correct
- Ensure environment variables are loaded (restart server)
- Verify API Key format is correct

### 3. Ollama Unavailable

**Issue**: `ollama service is unavailable`

**Solution**:
```bash
# Start Ollama
ollama serve

# Verify Ollama is running
curl http://localhost:11434/api/version

# Download model (if needed)
ollama pull llama2
```

### 4. Timeout Error

**Issue**: Request timeout

**Solution**:
- Check network connection
- For cloud providers, verify network can access external APIs
- Increase timeout settings (in `src/lib/config.ts`)

## Performance Benchmarking

### Response Time Test

```bash
# Use time command to test response time
time curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","provider":"openai","model":"gpt-3.5-turbo"}'
```

### Concurrent Test

```bash
# Use Apache Bench (ab) for concurrent testing
ab -n 100 -c 10 -p request.json -T application/json http://localhost:3000/api/chat
```

Where `request.json` contains:

```json
{"message":"test message","provider":"openai","model":"gpt-3.5-turbo"}
```

## Next Steps

1. **Frontend Integration**: Refer to React examples in `docs/cn/integration/CLOUD_LLM_INTEGRATION.md`
2. **Add User Interface**: Update Dashboard component to support provider selection
3. **Implement Caching**: Add response caching to reduce API calls
4. **Monitoring and Logging**: Implement request logging and error monitoring

## Related Documentation

- [Complete Cloud LLM Integration Guide](./CLOUD_LLM_INTEGRATION.md)
- [Express Integration Summary](./EXPRESS_INTEGRATION_SUMMARY.md)
- [API Reference Documentation](../../api/express-api.md)
