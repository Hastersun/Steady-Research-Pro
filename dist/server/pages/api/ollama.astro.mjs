import { O as OllamaClient } from '../../chunks/ollama-client_Cw8MwJju.mjs';
export { renderers } from '../../renderers.mjs';

// Ollama API 端点

const ollama = new OllamaClient();

async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: '请求体格式错误',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { action, ...params } = body;

  try {
    switch (action) {
      case 'health':
        const isHealthy = await ollama.checkHealth();
        return new Response(
          JSON.stringify({
            success: true,
            healthy: isHealthy,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      case 'models':
        const models = await ollama.getModels();
        return new Response(
          JSON.stringify({
            success: true,
            models,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      case 'generate':
        const { model, prompt, options } = params;
        if (!model || !prompt) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '缺少必要参数',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const response = await ollama.generate(model, prompt, options);
        return new Response(
          JSON.stringify({
            success: true,
            response,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      case 'chat':
        const { model: chatModel, messages, options: chatOptions } = params;
        if (!chatModel || !messages) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '缺少必要参数',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const chatResponse = await ollama.chat(chatModel, messages, chatOptions);
        return new Response(
          JSON.stringify({
            success: true,
            response: chatResponse,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      case 'pull':
        const { model: pullModel } = params;
        if (!pullModel) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '缺少模型名称',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        await ollama.pullModel(pullModel);
        return new Response(
          JSON.stringify({
            success: true,
            message: '模型拉取成功',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: '未知操作',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (error) {
    console.error('API 错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
