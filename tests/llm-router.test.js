import { describe, it, expect, beforeEach } from 'vitest';
import { HttpLLMClient } from '../src/lib/llm-router.js';

describe('HttpLLMClient', () => {
  describe('Constructor', () => {
    it('should initialize with provider name', () => {
      const client = new HttpLLMClient('openai');
      expect(client).toBeDefined();
      expect(client.provider).toBe('openai');
    });

    it('should accept configuration options', () => {
      const config = {
        baseUrl: 'http://test-api.com',
        apiKey: 'test-key',
        model: 'test-model',
      };
      const client = new HttpLLMClient('openai', config);
      expect(client).toBeDefined();
      expect(client.provider).toBe('openai');
    });

    it('should throw error without provider name', () => {
      expect(() => new HttpLLMClient()).toThrow('HttpLLMClient requires a provider name');
    });
  });

  describe('Configuration methods', () => {
    let client;

    beforeEach(() => {
      client = new HttpLLMClient('openai');
    });

    it('should update configuration', () => {
      const newConfig = {
        baseUrl: 'http://new-api.com',
        model: 'new-model',
      };
      client.updateConfig(newConfig);
      expect(client).toBeDefined();
    });

    it('should validate configuration', () => {
      expect(() => client.updateConfig(null)).not.toThrow();
      expect(() => client.updateConfig({})).not.toThrow();
    });
  });

  describe('Provider handling', () => {
    it('should handle different providers', () => {
      const openaiClient = new HttpLLMClient('openai');
      const deepseekClient = new HttpLLMClient('deepseek');

      expect(openaiClient.provider).toBe('openai');
      expect(deepseekClient.provider).toBe('deepseek');
    });
  });
});
