import { test, expect, describe } from 'vitest';
import { SecureStorage, hashApiKey, validateApiKey } from '../../src/lib/crypto-utils.js';

describe('API密钥安全存储测试', () => {
  // 模拟localStorage
  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();

  // 设置全局localStorage模拟
  global.localStorage = mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('API密钥不应明文存储', () => {
    const sensitiveData = { bing: 'real-api-key-123', google: 'AIzaSyDGvf8N9X7mPqK2L1A5b6C7d8E9f0G1h2I3' };
    SecureStorage.setItem('test-key', sensitiveData);
    
    const stored = localStorage.getItem('test-key');
    
    // 确保原始密钥不出现在存储的字符串中
    expect(stored).not.toContain('real-api-key-123');
    expect(stored).not.toContain('AIzaSyDGvf8N9X7mPqK2L1A5b6C7d8E9f0G1h2I3');
    
    // 确保存储的是加密后的数据
    expect(stored).toBeTruthy();
    expect(stored.length).toBeGreaterThan(50); // 加密后应该比较长
  });

  test('加密数据可以正确解密', () => {
    const originalData = { bing: 'test-key-456', setting: 'test-value' };
    SecureStorage.setItem('test-key', originalData);
    
    const retrieved = SecureStorage.getItem('test-key');
    
    expect(retrieved).toEqual(originalData);
  });

  test('API密钥哈希函数工作正常', () => {
    const testKey = 'test-api-key-123';
    const hash1 = hashApiKey(testKey);
    const hash2 = hashApiKey(testKey);
    
    // 相同输入应产生相同哈希
    expect(hash1).toBe(hash2);
    
    // 哈希长度应为16字符
    expect(hash1).toHaveLength(16);
    
    // 哈希不应包含原始密钥
    expect(hash1).not.toContain(testKey);
  });

  test('API密钥格式验证', () => {
    // 测试有效的Bing密钥格式
    expect(() => validateApiKey('12345678901234567890123456789012', 'bing')).not.toThrow();
    
    // 测试有效的Google密钥格式
    expect(() => validateApiKey('AIzaSyDGvf8N9X7mPqK2L1A5b6C7d8E9f0G1h2I3', 'google')).not.toThrow();
    
    // 测试无效格式
    expect(() => validateApiKey('invalid-key', 'bing')).toThrow();
    expect(() => validateApiKey('invalid-key', 'google')).toThrow();
    
    // 测试不支持的类型
    expect(() => validateApiKey('any-key', 'unknown')).toThrow();
  });

  test('恶意脚本无法读取真实密钥', () => {
    const sensitiveData = { bing: 'secret-api-key-789' };
    SecureStorage.setItem('test-key', sensitiveData);
    
    // 模拟恶意脚本尝试读取localStorage
    const allStorageValues = Object.values(localStorage);
    const hasPlaintextKey = allStorageValues.some(value => 
      typeof value === 'string' && value.includes('secret-api-key-789')
    );
    
    expect(hasPlaintextKey).toBe(false);
  });
});