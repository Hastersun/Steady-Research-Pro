# Settings 组件文档

## 📋 概述

Settings 组件提供了一个简洁的配置界面，用于管理 AI 模型参数和 API 设置。所有配置都会持久化保存到浏览器的 localStorage 中。

**版本**: v2.0.0  
**最后更新**: 2025-11-06

## 🎯 核心功能

### 1. 配置管理

#### 配置项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **Base URL** | URL | `http://localhost:11434` | AI 服务的基础 URL |
| **Model** | string | `llama2` | 使用的 AI 模型名称 |
| **API Key** | password | `` | API 密钥（可选） |
| **Max Tokens** | number | `2048` | 最大生成 token 数量 (256-4096) |
| **Temperature** | number | `0.7` | 温度参数 (0.0-2.0) |

### 2. 持久化存储

- **存储位置**: `localStorage`
- **存储键**: `'ai-settings'`
- **格式**: JSON

```typescript
interface SettingsData {
  baseUrl: string;
  model: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
}
```

### 3. 自动加载

- 页面加载时自动从 localStorage 读取保存的配置
- 如果没有保存的配置，使用默认值
- 错误处理：读取失败时回退到默认值

## 🎨 UI 组件

### 抽象的可复用组件

#### TextInput (`src/components/TextInput.tsx`)

通用文本输入组件，支持多种输入类型。

```tsx
<TextInput
  id="base-url"
  label="Base URL"
  placeholder="http://localhost:11434"
  value={baseUrl}
  onChange={setBaseUrl}
  type="url"
/>
```

**Props**:
- `id`: string - 输入框唯一标识
- `label`: string - 显示的标签文本
- `value`: string - 当前值（受控）
- `defaultValue`: string - 默认值（非受控）
- `placeholder`: string - 占位符文本
- `onChange`: (value: string) => void - 值变化回调
- `type`: 'text' | 'password' | 'email' | 'url' - 输入类型

#### SliderWithInput (`src/components/SliderWithInput.tsx`)

滑块和数值输入的混合组件，适用于数值范围选择。

```tsx
<SliderWithInput
  id="maxTokens"
  label="Max Tokens"
  value={maxTokens}
  onChange={setMaxTokens}
  min={256}
  max={4096}
  step={256}
/>
```

**Props**:
- `id`: string - 组件唯一标识
- `label`: string - 显示的标签文本
- `value`: number - 当前值
- `onChange`: (value: number) => void - 值变化回调
- `min`: number - 最小值
- `max`: number - 最大值
- `step`: number - 步进值
- `showLabels`: boolean - 是否显示刻度标签（默认 true）

**特性**:
- 自动检测小数类型（step < 1）
- 滑块和输入框双向同步
- 显示最小值、中间值、最大值刻度
- 支持整数和小数格式化

## 💾 操作按钮

### Save Settings
- **功能**: 将当前配置保存到 localStorage
- **反馈**: 显示 "Saved!" 提示（3秒后自动消失）
- **快捷键**: 无

### Reset to Defaults
- **功能**: 重置所有配置为默认值，并清除 localStorage
- **确认**: 无确认对话框，立即执行
- **影响**: 所有配置恢复到初始状态

## 📁 文件结构

```
src/
├── components/
│   ├── Settings.tsx          # 主设置组件
│   ├── TextInput.tsx         # 文本输入组件
│   └── SliderWithInput.tsx   # 滑块输入组件
└── pages/
    └── settings.astro        # 设置页面
```

## 🔧 使用示例

### 在 Astro 页面中使用

```astro
---
import Layout from '@/layouts/Layout.astro';
import Settings from '@/components/Settings.tsx';
---

<Layout title="Settings" activePage="settings">
  <Settings client:load />
</Layout>
```

### 读取保存的配置

```typescript
// 在其他组件中读取配置
const getSettings = (): SettingsData | null => {
  try {
    const saved = localStorage.getItem('ai-settings');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
};
```

## 🎯 最佳实践

### 1. 配置验证
虽然组件内部有基本的类型检查，但建议在使用配置前进行验证：

```typescript
const validateSettings = (settings: any): settings is SettingsData => {
  return (
    typeof settings.baseUrl === 'string' &&
    typeof settings.model === 'string' &&
    typeof settings.apiKey === 'string' &&
    typeof settings.maxTokens === 'number' &&
    typeof settings.temperature === 'number' &&
    settings.maxTokens >= 256 &&
    settings.maxTokens <= 4096 &&
    settings.temperature >= 0 &&
    settings.temperature <= 2
  );
};
```

### 2. 安全性考虑
- API Key 使用 password 类型输入，避免明文显示
- localStorage 在同源策略保护下相对安全
- 敏感数据建议加密存储（未实现）

### 3. 用户体验
- 所有输入都是受控组件，确保状态一致
- 保存成功有明确的视觉反馈
- 重置操作可能需要添加确认对话框

## 🚀 未来改进

- [ ] 添加配置导出/导入功能
- [ ] 配置验证和错误提示
- [ ] 重置操作的确认对话框
- [ ] 支持多套配置方案切换
- [ ] 配置加密存储
- [ ] 与后端同步配置

## 📝 变更历史

### v2.0.0 (2025-11-06)
- 重构为单一 AI Configuration 卡片
- 移除标签页结构（之前有 AI Model、API、Preferences、System）
- 抽象出 TextInput 和 SliderWithInput 可复用组件
- 实现 localStorage 持久化
- 添加 Save 和 Reset 功能
- 所有输入改为受控组件

### v1.0.0
- 初始版本
- 多标签页结构
- 基础配置项
