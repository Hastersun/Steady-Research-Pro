// 研究任务 API 端点
import ResearchTaskProcessor from '../../lib/research-processor.js';

const processor = new ResearchTaskProcessor();

export async function POST({ request }) {
  const { action, query, model, options } = await request.json();

  if (!query || !model) {
    return new Response(
      JSON.stringify({
        success: false,
        error: '缺少必要参数: query 和 model',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    switch (action) {
      case 'start_research':
        // 检查是否已有任务在进行
        const status = processor.getProcessingStatus();
        if (status.isProcessing) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '已有研究任务在进行中，请等待完成',
            }),
            {
              status: 409,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // 启动新的研究任务（异步）
        processor.processResearchTask(query, model, null, options).catch(error => {
          console.error('研究任务执行失败:', error);
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: '研究任务已启动',
            taskId: Date.now().toString(),
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      case 'get_status':
        const currentStatus = processor.getProcessingStatus();
        return new Response(
          JSON.stringify({
            success: true,
            status: currentStatus,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

      case 'stop_research':
        processor.stopProcessing();
        return new Response(
          JSON.stringify({
            success: true,
            message: '研究任务已停止',
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
    console.error('研究任务 API 错误:', error);
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
