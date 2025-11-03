# Dark Mode 快速参考

## 🚀 5秒快速开始

主题切换按钮已添加到页面右上角。点击即可切换！

## 📍 组件位置

```
src/
├── components/
│   └── ThemeToggle.tsx          # 主题切换组件
├── layouts/
│   └── Layout.astro             # 已集成主题切换
└── styles/
    └── globals.css              # 主题颜色配置
```

## 💻 快速使用

### 在新页面中使用

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout title="我的页面">
  <div class="bg-white dark:bg-gray-900 p-4">
    <h1 class="text-black dark:text-white">标题</h1>
  </div>
</Layout>
```

### 添加暗色样式

使用 Tailwind 的 `dark:` 前缀：

```html
<!-- 背景色 -->
<div class="bg-white dark:bg-gray-900">

<!-- 文字颜色 -->
<p class="text-gray-900 dark:text-gray-100">

<!-- 边框 -->
<div class="border border-gray-200 dark:border-gray-700">

<!-- 悬停状态 -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">
```

## 🎨 常用颜色组合

### 背景
```css
bg-white dark:bg-gray-900          # 页面背景
bg-gray-50 dark:bg-gray-800        # 卡片背景
bg-gray-100 dark:bg-gray-700       # 次要背景
```

### 文字
```css
text-gray-900 dark:text-gray-100   # 主要文字
text-gray-600 dark:text-gray-400   # 次要文字
text-gray-500 dark:text-gray-500   # 占位文字
```

### 边框
```css
border-gray-200 dark:border-gray-700   # 边框
border-gray-300 dark:border-gray-600   # 强调边框
```

## 🔧 自定义主题颜色

编辑 `src/styles/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;     /* 你的主色调 */
}

.dark {
  --primary: 210 40% 98%;           /* 深色主题的主色调 */
}
```

## 📱 在 React 组件中检测主题

```tsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return <div>{isDark ? '🌙' : '☀️'}</div>;
}
```

## ⌨️ 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🐛 快速调试

### 问题：切换不生效

**检查**:
1. Tailwind 配置中有 `darkMode: ["class"]`
2. 组件使用 `client:load` 指令
3. 浏览器控制台无错误

### 问题：页面加载闪烁

**解决**:
确保 `Layout.astro` 的 `<head>` 中有防闪烁脚本：

```astro
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>
```

## 📊 颜色变量速查

| 变量 | 用途 |
|------|------|
| `--background` | 页面背景 |
| `--foreground` | 文字颜色 |
| `--primary` | 主要按钮/链接 |
| `--secondary` | 次要元素 |
| `--muted` | 弱化元素 |
| `--accent` | 强调元素 |
| `--destructive` | 危险/删除操作 |
| `--border` | 边框颜色 |

## 🎯 使用技巧

1. **优先使用语义化颜色**
   ```html
   <button class="bg-primary text-primary-foreground">
   ```

2. **测试对比度**
   使用浏览器开发工具检查颜色对比度是否符合 WCAG 标准

3. **渐进增强**
   确保在不支持深色模式的浏览器中仍然可用

4. **性能优化**
   主题切换使用 CSS 变量，无需重新加载页面

## 🔗 相关文档

- [完整指南](./DARK_MODE_GUIDE.md)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

**快速问题？** 查看 [完整文档](./DARK_MODE_GUIDE.md) 或提交 Issue
