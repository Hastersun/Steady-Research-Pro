// 流式生成 API 端点
import OllamaClient from '../../lib/ollama-client.js';

const ollama = new OllamaClient();

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response('请求体格式错误', { status: 400 });
  }

  const { action, model, prompt, messages, options } = body;

  if (!model) {
    return new Response('缺少模型参数', { status: 400 });
  }

  // 创建一个可读流
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        if (action === 'generate' && prompt) {
          // 流式生成
          await ollama.generateStream(
            model,
            prompt,
            (chunk, done, error) => {
              if (error) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
                );
                controller.close();
                return;
              }

              if (!done) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
              } else {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                controller.close();
              }
            },
            options
          );
        } else if (action === 'chat' && messages) {
          // 流式聊天
          await ollama.chatStream(
            model,
            messages,
            (chunk, done, error) => {
              if (error) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
                );
                controller.close();
                return;
              }

              if (!done) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
              } else {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                controller.close();
              }
            },
            options
          );
        } else {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: '无效的操作或缺少必要参数' })}\n\n`)
          );
          controller.close();
        }
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
