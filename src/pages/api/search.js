// 搜索 API 端点
import searchEngineClient from '../../lib/search-engines.js';

// 轻量内联：统一响应与错误分类（避免新文件行尾风格带来的 Lint 噪音）
const okJson = (data, status = 200) =>
  new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const makeError = (code, message, { status = 500, retryable = false, details } = {}) => {
  const payload = {
    success: false,
    error: { code, message, status, retryable },
    meta: { timestamp: new Date().toISOString() },
  };
  if (details !== undefined) payload.error.details = details;
  return payload;
};

const errorJson = payload =>
  new Response(JSON.stringify(payload), {
    status: payload?.error?.status || 500,
    headers: { 'Content-Type': 'application/json' },
  });

const classifyError = (e, fallback = { code: 'INTERNAL_ERROR', status: 500 }) => {
  const msg = (e && e.message) || String(e);
  const isAbort = e?.name === 'AbortError';
  if (isAbort || /timeout/i.test(msg)) return { code: 'TIMEOUT', status: 504, retryable: true };
  if (/429/.test(msg)) return { code: 'RATE_LIMITED', status: 429, retryable: true };
  if (/5\d{2}/.test(msg) || /upstream|gateway|fetch failed/i.test(msg))
    return { code: 'UPSTREAM_ERROR', status: 502, retryable: true };
  return { code: fallback.code, status: fallback.status, retryable: false };
};

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { action, query, engines = ['bing', 'google'], options = {}, apiKeys = {} } = body;

    if (!query) {
      return errorJson(makeError('VALIDATION_ERROR', '搜索查询不能为空', { status: 400 }));
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
          return okJson(result);
        } catch (error) {
          const cls = classifyError(error, { code: 'SEARCH_FAILED', status: 500 });
          return errorJson(
            makeError(cls.code, `搜索失败: ${error.message}`, {
              status: cls.status,
              retryable: cls.retryable,
            })
          );
        }

      case 'bing-only':
        // 仅使用 Bing 搜索
        try {
          result = await searchEngineClient.searchBing(query, options.bing || {});
          return okJson(result);
        } catch (error) {
          const cls = classifyError(error, { code: 'UPSTREAM_ERROR', status: 502 });
          return errorJson(
            makeError('BING_SEARCH_FAILED', `Bing 搜索失败: ${error.message}`, {
              status: cls.status,
              retryable: cls.retryable,
              details: { engine: 'bing' },
            })
          );
        }

      case 'google-only':
        // 仅使用 Google 搜索
        try {
          result = await searchEngineClient.searchGoogle(query, options.google || {});
          return okJson(result);
        } catch (error) {
          const cls = classifyError(error, { code: 'UPSTREAM_ERROR', status: 502 });
          return errorJson(
            makeError('GOOGLE_SEARCH_FAILED', `Google 搜索失败: ${error.message}`, {
              status: cls.status,
              retryable: cls.retryable,
              details: { engine: 'google' },
            })
          );
        }

      case 'generate-queries':
        // 生成搜索查询建议
        const { domain = 'general' } = options;
        const suggestions = searchEngineClient.generateSearchQueries(query, domain);
        return okJson({
          original: query,
          suggestions,
          domain,
        });

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

          return okJson({
            message: 'API 配置已更新',
            configured: {
              bing: !!bingApiKey,
              google: !!(googleApiKey && googleCseId),
            },
          });
        } catch (error) {
          return errorJson(
            makeError('CONFIG_ERROR', `配置失败: ${error.message}`, { status: 400 })
          );
        }

      default:
        return errorJson(
          makeError(
            'INVALID_ACTION',
            `未知操作: ${action}。支持的操作: search, bing-only, google-only, generate-queries, config`,
            { status: 400 }
          )
        );
    }
  } catch (error) {
    console.error('搜索 API 错误:', error);
    const cls = classifyError(error, { code: 'INTERNAL_ERROR', status: 500 });
    return errorJson(
      makeError(cls.code, '服务器内部错误', { status: cls.status, retryable: cls.retryable })
    );
  }
}

export async function GET({ url }) {
  // GET 请求用于简单的搜索查询
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get('q') || searchParams.get('query');
  const engine = searchParams.get('engine') || 'both';

  if (!query) {
    return errorJson(
      makeError('VALIDATION_ERROR', '缺少搜索查询参数 (q 或 query)', { status: 400 })
    );
  }

  // 转换为 POST 请求格式处理
  const mockRequest = {
    json: async () => ({
      action: engine === 'both' ? 'search' : `${engine}-only`,
      query,
      engines: engine === 'both' ? ['bing', 'google'] : [engine],
    }),
  };

  return await POST({ request: mockRequest });
}
