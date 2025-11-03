# Dark Mode 使用指南

## 功能概述

项目已成功集成 Dark Mode（深色模式）功能，用户可以在浅色和深色主题之间自由切换。

## ✨ 主要特性

- 🌓 **自动主题切换** - 点击按钮即可在浅色/深色模式间切换
- 💾 **持久化存储** - 主题偏好保存在 localStorage，刷新页面后保持
- 🎨 **平滑过渡** - 主题切换时的颜色平滑过渡效果
- 🚀 **防止闪烁** - 页面加载时不会出现主题闪烁
- 📱 **系统偏好检测** - 自动检测系统的深色模式偏好
- ♿ **无障碍支持** - 包含屏幕阅读器支持

## 🎯 使用方法

### 用户操作

1. 在页面右上角找到主题切换按钮
2. 点击按钮切换主题：
   - 🌙 月亮图标 = 当前是浅色模式，点击切换到深色
   - ☀️ 太阳图标 = 当前是深色模式，点击切换到浅色
3. 主题偏好会自动保存，下次访问时保持

### 键盘导航

主题切换按钮支持键盘访问：
- 使用 `Tab` 键导航到按钮
- 按 `Enter` 或 `Space` 键切换主题

## 🔧 技术实现

### 核心组件

#### ThemeToggle 组件 (`src/components/ThemeToggle.tsx`)

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// 在 Astro 组件中使用
<ThemeToggle client:load />
```

**关键特性**：
- React hooks 管理主题状态
- localStorage 持久化
- 系统偏好检测
- 防止 SSR 闪烁

### 布局集成 (`src/layouts/Layout.astro`)

```astro
<!-- 1. 导入组件 -->
import { ThemeToggle } from '@/components/ThemeToggle';

<!-- 2. 防闪烁脚本（在 head 中） -->
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>

<!-- 3. 添加切换按钮 -->
<ThemeToggle client:load />
```

### CSS 配置 (`src/styles/globals.css`)

```css
/* 已配置的颜色变量 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... 其他浅色主题变量 ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... 其他深色主题变量 ... */
}

/* 平滑过渡效果 */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Tailwind 配置 (`tailwind.config.mjs`)

```javascript
export default {
  darkMode: ["class"], // 使用 class 策略
  // ... 其他配置
}
```

## 🎨 自定义颜色

### 修改浅色主题颜色

在 `src/styles/globals.css` 的 `:root` 部分修改：

```css
:root {
  --background: 0 0% 100%;        /* 白色背景 */
  --foreground: 222.2 84% 4.9%;   /* 深色文字 */
  --primary: 222.2 47.4% 11.2%;   /* 主色调 */
  /* 根据需要调整其他颜色 */
}
```

### 修改深色主题颜色

在 `.dark` 部分修改：

```css
.dark {
  --background: 222.2 84% 4.9%;   /* 深色背景 */
  --foreground: 210 40% 98%;      /* 浅色文字 */
  --primary: 210 40% 98%;         /* 主色调 */
  /* 根据需要调整其他颜色 */
}
```

## 📝 在代码中使用主题

### 在 React 组件中

```tsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      当前主题: {isDark ? '深色' : '浅色'}
    </div>
  );
}
```

### 在 Astro 组件中

```astro
---
// 使用 Tailwind 的 dark: 变体
---

<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  这段文字会根据主题自动切换颜色
</div>

<button class="
  bg-blue-500 dark:bg-blue-700
  hover:bg-blue-600 dark:hover:bg-blue-800
  text-white
">
  按钮也支持 dark mode
</button>
```

## 🔍 常见问题

### Q: 为什么页面加载时会闪烁？

**A**: 确保在 `<head>` 标签中包含了防闪烁脚本，并且使用 `is:inline` 属性：

```astro
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>
```

### Q: 主题切换后样式不生效？

**A**: 确保：
1. Tailwind 配置中设置了 `darkMode: ["class"]`
2. 使用了 Tailwind 的 `dark:` 变体
3. CSS 变量正确定义在 `:root` 和 `.dark` 中

### Q: 如何改变主题切换按钮的位置？

**A**: 在 `Layout.astro` 中移动 `<ThemeToggle client:load />` 组件到想要的位置。

### Q: 能否添加更多主题选项？

**A**: 可以扩展 `ThemeToggle` 组件支持多个主题：

```tsx
const themes = ['light', 'dark', 'blue', 'green'];
const [theme, setTheme] = useState('light');

const cycleTheme = () => {
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const newTheme = themes[nextIndex];
  // 应用新主题...
};
```

## 🎯 最佳实践

### 1. 使用语义化的颜色变量

```css
/* 推荐 */
.button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* 不推荐 */
.button {
  background: #000;
  color: #fff;
}
```

### 2. 测试两种主题

确保在开发时测试浅色和深色两种主题：
- 检查文字可读性
- 确认对比度足够
- 测试所有交互状态

### 3. 考虑图片和媒体

```astro
<!-- 为不同主题提供不同的图片 -->
<picture>
  <source srcset="/images/logo-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="/images/logo-light.svg" alt="Logo">
</picture>
```

### 4. 使用过渡效果

```css
/* 为颜色变化添加平滑过渡 */
.element {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## 🚀 进阶功能

### 添加主题选择器（多主题支持）

```tsx
type Theme = 'light' | 'dark' | 'system';

function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>('system');

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <select value={theme} onChange={(e) => applyTheme(e.target.value as Theme)}>
      <option value="light">浅色</option>
      <option value="dark">深色</option>
      <option value="system">跟随系统</option>
    </select>
  );
}
```

### 监听系统主题变化

```tsx
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    if (localStorage.getItem('theme') === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

## 📊 浏览器兼容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |
| classList.toggle | ✅ 8+ | ✅ 3.6+ | ✅ 5.1+ | ✅ 12+ |
| matchMedia | ✅ 9+ | ✅ 6+ | ✅ 5.1+ | ✅ 10+ |
| localStorage | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 8+ |

## 🔗 相关资源

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)

## 📝 更新日志

### v1.1.0 - 2025-11-03
- ✅ 添加 Dark Mode 支持
- ✅ 创建 ThemeToggle 组件
- ✅ 实现主题持久化
- ✅ 添加防闪烁脚本
- ✅ 系统主题偏好检测
- ✅ 平滑过渡动画

---

**维护者**: AI Agent Team  
**最后更新**: 2025-11-03
