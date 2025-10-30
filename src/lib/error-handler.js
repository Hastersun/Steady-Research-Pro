/* eslint-disable linebreak-style */
// 统一错误处理与响应工具

/**
 * 创建标准错误对象
 * @param {string} code 错误编码（如 INTERNAL_ERROR/VALIDATION_ERROR/UPSTREAM_ERROR）
 * @param {string} message 人类可读错误信息
 * @param {object} [opts]
 * @param {number} [opts.status=500] HTTP 状态码
 * @param {boolean} [opts.retryable=false] 是否可重试
 * @param {any} [opts.details] 额外细节（如引擎、参数等）
 * @returns {{ success: false, error: { code: string, message: string, status: number, retryable: boolean, details?: any }, meta: { timestamp: string } }}
 */
export function makeError(code, message, opts = {}) {
  const { status = 500, retryable = false, details } = opts;
  const payload = {
    success: false,
    error: {
      code,
      message,
      status,
      retryable,
    },
    meta: { timestamp: new Date().toISOString() },
  };
  if (details !== undefined) payload.error.details = details;
  return payload;
}

/**
 * 返回 JSON 响应（成功）
 * @param {any} data 业务数据
 * @param {number} [status=200] HTTP 状态码
 */
export function okJson(data, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * 返回 JSON 错误响应（统一格式）
 * @param {ReturnType<typeof makeError>} errorPayload 由 makeError 生成
 */
export function errorJson(errorPayload) {
  const status = errorPayload?.error?.status || 500;
  return new Response(JSON.stringify(errorPayload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * 粗粒度错误分类
 * - 将上游/网络错误映射为统一 code 与可重试属性
 */
export function classifyError(e, fallback = { code: 'INTERNAL_ERROR', status: 500 }) {
  const msg = (e && e.message) || String(e);
  const isAbort = e?.name === 'AbortError';
  if (isAbort || /timeout/i.test(msg)) {
    return { code: 'TIMEOUT', status: 504, retryable: true };
  }
  if (/429/.test(msg)) {
    return { code: 'RATE_LIMITED', status: 429, retryable: true };
  }
  if (/5\d{2}/.test(msg) || /upstream|gateway|fetch failed/i.test(msg)) {
    return { code: 'UPSTREAM_ERROR', status: 502, retryable: true };
  }
  return { code: fallback.code, status: fallback.status, retryable: false };
}
