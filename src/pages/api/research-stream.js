// 流式研究任务 API 端点
import ResearchTaskProcessor from '../../lib/research-processor.js';

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response('请求体格式错误', { status: 400 });
  }
  
  const { query, model, options } = body;

  if (!query || !model) {
    return new Response('缺少必要参数', { status: 400 });
  }

  const processor = new ResearchTaskProcessor();

  // 创建一个可读流
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        await processor.processResearchTask(
          query,
          model,
          (stepId, status, progress, message, data) => {
            // 发送进度更新
            const update = {
              stepId,
              status,
              progress: Math.round(progress * 100),
              message,
              data: data ? (typeof data === 'string' ? data : JSON.stringify(data, null, 2)) : null,
              timestamp: new Date().toISOString()
            };

            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
            } catch (error) {
              console.error('发送数据失败:', error);
            }

            // 如果是最后一步完成，关闭流
            if (stepId === 'synthesis' && status === 'complete') {
              setTimeout(() => {
                try {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                  controller.close();
                } catch (error) {
                  console.error('关闭流失败:', error);
                  controller.close();
                }
              }, 1000);
            }
          },
          options
        );
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          stepId: 'error',
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}