import { describe, it, expect, beforeEach } from 'vitest';
import { SearchEngineClient } from '../src/lib/search-engines.js';

describe('SearchEngineClient', () => {
  let client;

  beforeEach(() => {
    client = new SearchEngineClient();
  });

  describe('Configuration', () => {
    it('should initialize with default configuration', () => {
      expect(client.bingApiKey).toBe(null);
      expect(client.googleApiKey).toBe(null);
      expect(client.googleCseId).toBe(null);
    });

    it('should set API keys correctly', () => {
      client.setApiKey('bing', 'test-bing-key');
      expect(client.bingApiKey).toBe('test-bing-key');

      client.setApiKey('google', 'test-google-key', 'test-cse-id');
      expect(client.googleApiKey).toBe('test-google-key');
      expect(client.googleCseId).toBe('test-cse-id');
    });

    it('should throw error for unsupported search engines', () => {
      expect(() => {
        client.setApiKey('unsupported', 'key');
      }).toThrow('不支持的搜索引擎: unsupported');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for Bing search without API key', async () => {
      await expect(client.bingSearch('test query')).rejects.toThrow('未设置 Bing API 密钥');
    });

    it('should throw error for Google search without API key', async () => {
      await expect(client.googleSearch('test query')).rejects.toThrow(
        '未设置 Google API 密钥或 CSE ID'
      );
    });

    it('should handle unknown search engines in searchMultiple', async () => {
      await expect(client.searchMultiple('test query', ['unknown'])).rejects.toThrow(
        '不支持的搜索引擎: unknown'
      );
    });
  });

  describe('Search Multiple', () => {
    it('should handle empty engines array', async () => {
      const results = await client.searchMultiple('test query', []);
      expect(results).toEqual([]);
    });

    it('should validate query parameter', async () => {
      await expect(client.searchMultiple('', ['bing'])).rejects.toThrow();
      await expect(client.searchMultiple(null, ['bing'])).rejects.toThrow();
    });
  });
});
