// 搜索 API 端点
import searchEngineClient from '../../lib/search-engines.js';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { 
      action, 
      query, 
      engines = ['bing', 'google'],
      options = {},
      apiKeys = {}
    } = body;

    if (!query) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '搜索查询不能为空' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 设置 API 密钥（如果提供）
    if (apiKeys.bing) {
      searchEngineClient.setApiKey('bing', apiKeys.bing);
    }
    if (apiKeys.google && apiKeys.googleCseId) {
      searchEngineClient.setApiKey('google', apiKeys.google, apiKeys.googleCseId);
    }

    let result;

    switch (action) {
      case 'search':
        // 多引擎搜索
        try {
          result = await searchEngineClient.multiEngineSearch(query, engines, options);
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: result 
            }), 
            { 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `搜索失败: ${error.message}` 
            }), 
            { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

      case 'bing-only':
        // 仅使用 Bing 搜索
        try {
          result = await searchEngineClient.searchBing(query, options.bing || {});
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: result 
            }), 
            { 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Bing 搜索失败: ${error.message}` 
            }), 
            { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

      case 'google-only':
        // 仅使用 Google 搜索
        try {
          result = await searchEngineClient.searchGoogle(query, options.google || {});
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: result 
            }), 
            { 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Google 搜索失败: ${error.message}` 
            }), 
            { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

      case 'generate-queries':
        // 生成搜索查询建议
        const { domain = 'general' } = options;
        const suggestions = searchEngineClient.generateSearchQueries(query, domain);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { 
              original: query,
              suggestions,
              domain
            } 
          }), 
          { 
            headers: { 'Content-Type': 'application/json' }
          }
        );

      case 'config':
        // 设置 API 配置
        const { bingApiKey, googleApiKey, googleCseId } = body;
        
        try {
          if (bingApiKey) {
            searchEngineClient.setApiKey('bing', bingApiKey);
          }
          if (googleApiKey && googleCseId) {
            searchEngineClient.setApiKey('google', googleApiKey, googleCseId);
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'API 配置已更新',
              configured: {
                bing: !!bingApiKey,
                google: !!(googleApiKey && googleCseId)
              }
            }), 
            { 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `配置失败: ${error.message}` 
            }), 
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `未知操作: ${action}。支持的操作: search, bing-only, google-only, generate-queries, config` 
          }), 
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error) {
    console.error('搜索 API 错误:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET({ url }) {
  // GET 请求用于简单的搜索查询
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get('q') || searchParams.get('query');
  const engine = searchParams.get('engine') || 'both';
  
  if (!query) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '缺少搜索查询参数 (q 或 query)' 
      }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // 转换为 POST 请求格式处理
  const mockRequest = {
    json: async () => ({
      action: engine === 'both' ? 'search' : `${engine}-only`,
      query,
      engines: engine === 'both' ? ['bing', 'google'] : [engine]
    })
  };

  return await POST({ request: mockRequest });
}