import { test, expect, describe } from 'vitest';
import { makeError } from '../src/lib/error-handler.js';

describe('统一错误格式', () => {
  test('makeError 创建标准结构', () => {
    const err = makeError('VALIDATION_ERROR', '缺少参数', { status: 400, retryable: false, details: { field: 'query' } });
    expect(err.success).toBe(false);
    expect(err.error).toBeDefined();
    expect(err.error.code).toBe('VALIDATION_ERROR');
    expect(err.error.message).toBe('缺少参数');
    expect(err.error.status).toBe(400);
    expect(err.error.retryable).toBe(false);
    expect(err.error.details).toEqual({ field: 'query' });
    expect(err.meta.timestamp).toBeTruthy();
  });
});
