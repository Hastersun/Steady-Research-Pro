import { test, expect, describe } from 'vitest';
import { t, getLocale, setLocale } from '../src/lib/i18n.js';

describe('国际化翻译测试', () => {
  test('核心翻译键存在', () => {
    // 测试中文翻译
    setLocale('zh-CN');
    expect(t('common.language')).toBe('语言');
    expect(t('common.statusReady')).toBe('连接正常');
    expect(t('layout.title')).toBe('Steady Research Pro');
    expect(t('sidePanel.title')).toBe('AI 研究配置');

    // 测试英文翻译
    setLocale('en-US');
    expect(t('common.language')).toBe('Language');
    expect(t('common.statusReady')).toBe('Online');
    expect(t('layout.title')).toBe('Steady Research Pro');
    expect(t('sidePanel.title')).toBe('Research setup');
  });

  test('错误消息翻译', () => {
    setLocale('zh-CN');
    expect(t('errors.networkError')).toBe('网络连接失败');
    expect(t('errors.unauthorized')).toBe('身份验证失败');

    setLocale('en-US');
    expect(t('errors.networkError')).toBe('Network connection failed');
    expect(t('errors.unauthorized')).toBe('Authentication failed');
  });

  test('操作按钮翻译', () => {
    setLocale('zh-CN');
    expect(t('actions.save')).toBe('保存');
    expect(t('actions.retry')).toBe('重试');

    setLocale('en-US');
    expect(t('actions.save')).toBe('Save');
    expect(t('actions.retry')).toBe('Retry');
  });

  test('验证消息翻译', () => {
    setLocale('zh-CN');
    expect(t('validation.required')).toBe('此字段为必填项');
    expect(t('validation.invalidApiKey')).toBe('API密钥格式无效');

    setLocale('en-US');
    expect(t('validation.required')).toBe('This field is required');
    expect(t('validation.invalidApiKey')).toBe('Invalid API key format');
  });

  test('参数插值功能', () => {
    setLocale('zh-CN');
    expect(t('searchConfig.toastSearchSuccess', { count: 5 })).toBe('搜索完成，共返回 5 条结果');

    setLocale('en-US');
    expect(t('searchConfig.toastSearchSuccess', { count: 5 })).toBe(
      'Search completed with 5 results'
    );
  });

  test('缺失翻译回退机制', () => {
    const missingKey = 'nonexistent.key';
    setLocale('zh-CN');
    expect(t(missingKey)).toBe('（缺少翻译）');

    setLocale('en-US');
    expect(t(missingKey)).toBe('（缺少翻译）');
  });

  test('语言切换功能', () => {
    expect(setLocale('zh-CN')).toBe('zh-CN');
    expect(getLocale()).toBe('zh-CN');

    expect(setLocale('en-US')).toBe('en-US');
    expect(getLocale()).toBe('en-US');

    // 测试无效语言回退到默认
    expect(setLocale('invalid-locale')).toBe('zh-CN');
    expect(getLocale()).toBe('zh-CN');
  });

  test('搜索配置相关翻译', () => {
    setLocale('zh-CN');
    expect(t('searchConfig.title')).toBe('搜索引擎 API 配置');
    expect(t('searchConfig.testButton')).toBe('测试搜索');

    setLocale('en-US');
    expect(t('searchConfig.title')).toBe('Search API setup');
    expect(t('searchConfig.testButton')).toBe('Run test search');
  });

  test('AI服务相关翻译', () => {
    setLocale('zh-CN');
    expect(t('aiService.title')).toBe('AI 服务接入');
    expect(t('aiService.testButton')).toBe('测试连接');

    setLocale('en-US');
    expect(t('aiService.title')).toBe('AI service providers');
    expect(t('aiService.testButton')).toBe('Test connection');
  });
});
