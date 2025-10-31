# Quick Test Guide

## 🚀 Express Server Successfully Integrated!

### Current Status
✅ Express server is running
✅ All routes are configured
✅ Documentation is complete

### Quick Test

#### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-13T...",
  "uptime": 123.45
}
```

#### 2. Get Models List (Requires Ollama Running)
```bash
curl http://localhost:3000/api/models
```

#### 3. Send Chat Message (Requires Ollama Running)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello, introduce yourself\", \"model\": \"llama2\"}"
```

### Test in Browser

Open directly in browser:
- http://localhost:3000/health - Check server status
- http://localhost:3000/api/models - View available models

### Test with PowerShell

```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:3000/health -Method Get

# Get models
Invoke-RestMethod -Uri http://localhost:3000/api/models -Method Get

# Send message
$body = @{
    message = "Hello!"
    model = "llama2"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/chat -Method Post -Body $body -ContentType "application/json"
```

### 📁 Created Files

#### Core Files
- ✅ `src/server.ts` - Express main server
- ✅ `src/routes/chat.ts` - Chat routes
- ✅ `src/routes/models.ts` - Model management routes
- ✅ `.env.example` - Environment variable template

#### Documentation Files
- ✅ `docs/integration/EXPRESS_INTEGRATION_SUMMARY.md` - Integration summary
- ✅ `docs/integration/EXPRESS_INTEGRATION_SUMMARY.en.md` - Integration summary (English)
- ✅ `docs/testing/QUICK_TEST.md` - This test guide
- ✅ `docs/testing/QUICK_TEST.en.md` - This test guide (English)

#### Updated Files
- ✅ `package.json` - Added Express scripts
- ✅ `README.md` - Updated project description

### 📚 View Documentation

- **Integration Summary**: [docs/integration/EXPRESS_INTEGRATION_SUMMARY.en.md](../integration/EXPRESS_INTEGRATION_SUMMARY.en.md)
- **React Integration**: [docs/integration/REACT_SHADCN_INTEGRATION.en.md](../integration/REACT_SHADCN_INTEGRATION.en.md)

### 🎯 Next Steps

1. **Ensure Ollama is Running**
   ```bash
   ollama serve
   ```

2. **Download Models** (if not already done)
   ```bash
   ollama pull llama2
   ```

3. **Test Full Functionality**
   - Start Express: `npm run server:dev`
   - Start Astro: `npm run dev` (in another terminal)
   - Visit: http://localhost:4321

### 🔥 Advanced Testing

#### JavaScript Client Test

Create a test file `test-client.js`:

```javascript
// test-client.js
async function testAPI() {
  const BASE_URL = 'http://localhost:3000';
  
  // 1. Health check
  console.log('1. Testing health check...');
  const health = await fetch(`${BASE_URL}/health`);
  console.log(await health.json());
  
  // 2. Get models list
  console.log('\n2. Getting models list...');
  const models = await fetch(`${BASE_URL}/api/models`);
  console.log(await models.json());
  
  // 3. Send message
  console.log('\n3. Sending chat message...');
  const chat = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello, please introduce yourself briefly',
      model: 'llama2'
    })
  });
  console.log(await chat.json());
}

testAPI().catch(console.error);
```

Run:
```bash
node test-client.js
```

#### React Component Test

Test the Dashboard component in your browser:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:4321

3. Verify:
   - ✅ Dashboard renders correctly
   - ✅ Navigation works
   - ✅ Responsive design adapts to screen size
   - ✅ All UI components display properly

### ✅ Verification Checklist

- [ ] Express server running on port 3000
- [ ] Health check returns 200 status code
- [ ] Can retrieve models list (if Ollama is running)
- [ ] Can send chat messages (if Ollama is running)
- [ ] CORS configured correctly (frontend can access)
- [ ] Documentation is accessible
- [ ] React components render correctly
- [ ] Responsive design works on mobile/desktop

### 🆘 Troubleshooting

#### Express Server Won't Start

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Change port in .env file
PORT=3001
```

#### Ollama Connection Failed

**Problem**: Cannot connect to Ollama service

**Solutions**:
1. Start Ollama service:
   ```bash
   ollama serve
   ```

2. Verify Ollama is running:
   ```bash
   curl http://localhost:11434/api/version
   ```

3. Check Ollama host in `.env`:
   ```env
   OLLAMA_HOST=http://localhost:11434
   ```

#### CORS Errors

**Problem**: Frontend cannot access API

**Solution**: Configure CORS origin in `.env`:
```env
CORS_ORIGIN=http://localhost:4321
```

#### Module Not Found Errors

**Problem**: Import errors in TypeScript

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 📊 Test Results Example

Successful test output should look like:

```
✅ Health Check: OK
   Status: 200
   Response: {"status":"ok","timestamp":"...","uptime":123.45}

✅ Models List: OK
   Status: 200
   Models: ["llama2:latest", "codellama:latest"]

✅ Chat Message: OK
   Status: 200
   Response: {"success":true,"data":"Hello! I am..."}

✅ Dashboard: OK
   Renders: ✓
   Navigation: ✓
   Responsive: ✓
```

### 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Astro Documentation](https://docs.astro.build/)
- [React Documentation](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Ollama Documentation](https://ollama.ai/docs)

---

**Integration Date**: 2025-10-31
**Version**: 1.0.0
**Status**: ✅ Ready for Development
