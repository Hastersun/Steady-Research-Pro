// AI模型支持：OpenAI API 示例
const https = require('https');

function callOpenAI(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    if (!apiKey || typeof apiKey !== 'string') {
      return reject(new Error('API Key 未设置'));
    }
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 256
    });
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          const content = result.choices?.[0]?.message?.content || '';
          resolve(content);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = { callOpenAI };
