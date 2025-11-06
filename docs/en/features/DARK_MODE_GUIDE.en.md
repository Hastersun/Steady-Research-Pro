# Dark Mode Usage Guide

## Feature Overview

The project has successfully integrated Dark Mode functionality, allowing users to freely switch between light and dark themes.

## ✨ Key Features

- 🌓 **Automatic Theme Switching** - Click button to switch between light/dark modes
- 💾 **Persistent Storage** - Theme preference saved in localStorage, persists after page refresh
- 🎨 **Smooth Transitions** - Smooth color transition effects during theme switching
- 🚀 **Flash Prevention** - No theme flickering during page load
- 📱 **System Preference Detection** - Automatically detects system dark mode preference
- ♿ **Accessibility Support** - Includes screen reader support

## 🎯 Usage

### User Actions

1. Find the theme toggle button in the top-right corner of the page
2. Click button to switch themes:
   - 🌙 Moon icon = Currently light mode, click to switch to dark
   - ☀️ Sun icon = Currently dark mode, click to switch to light
3. Theme preference is automatically saved and persists on next visit

### Keyboard Navigation

Theme toggle button supports keyboard access:
- Use `Tab` key to navigate to button
- Press `Enter` or `Space` key to toggle theme

## 🔧 Technical Implementation

### Core Components

#### ThemeToggle Component (`src/components/ThemeToggle.tsx`)

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// Use in Astro components
<ThemeToggle client:load />
```

**Key Features**:
- React hooks manage theme state
- localStorage persistence
- System preference detection
- SSR flash prevention

### Layout Integration (`src/layouts/Layout.astro`)

```astro
<!-- 1. Import component -->
import { ThemeToggle } from '@/components/ThemeToggle';

<!-- 2. Flash prevention script (in head) -->
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>

<!-- 3. Add toggle button -->
<ThemeToggle client:load />
```

### CSS Configuration (`src/styles/globals.css`)

```css
/* Configured color variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other light theme variables ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark theme variables ... */
}

/* Smooth transition effects */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Tailwind Configuration (`tailwind.config.mjs`)

```javascript
export default {
  darkMode: ["class"], // Use class strategy
  // ... other config
}
```

## 🎨 Custom Colors

### Modify Light Theme Colors

Modify in the `:root` section of `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;        /* White background */
  --foreground: 222.2 84% 4.9%;   /* Dark text */
  --primary: 222.2 47.4% 11.2%;   /* Primary color */
  /* Adjust other colors as needed */
}
```

### Modify Dark Theme Colors

Modify in the `.dark` section:

```css
.dark {
  --background: 222.2 84% 4.9%;   /* Dark background */
  --foreground: 210 40% 98%;      /* Light text */
  --primary: 210 40% 98%;         /* Primary color */
  /* Adjust other colors as needed */
}
```

## 📝 Using Theme in Code

### In React Components

```tsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect current theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      Current theme: {isDark ? 'Dark' : 'Light'}
    </div>
  );
}
```

### In Astro Components

```astro
---
// Use Tailwind's dark: variant
---

<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  This text will automatically switch colors based on theme
</div>

<button class="
  bg-blue-500 dark:bg-blue-700
  hover:bg-blue-600 dark:hover:bg-blue-800
  text-white
">
  Buttons also support dark mode
</button>
```

## 🔍 Common Issues

### Q: Why does the page flicker on load?

**A**: Ensure the flash prevention script is included in the `<head>` tag with the `is:inline` attribute:

```astro
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>
```

### Q: Styles not working after theme switch?

**A**: Ensure:
1. Tailwind config has `darkMode: ["class"]` set
2. Using Tailwind's `dark:` variant
3. CSS variables properly defined in `:root` and `.dark`

### Q: How to change theme toggle button position?

**A**: Move the `<ThemeToggle client:load />` component to the desired location in `Layout.astro`.

### Q: Can more theme options be added?

**A**: Yes, extend the `ThemeToggle` component to support multiple themes:

```tsx
const themes = ['light', 'dark', 'blue', 'green'];
const [theme, setTheme] = useState('light');

const cycleTheme = () => {
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const newTheme = themes[nextIndex];
  // Apply new theme...
};
```

## 🎯 Best Practices

### 1. Use Semantic Color Variables

```css
/* Recommended */
.button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Not recommended */
.button {
  background: #000;
  color: #fff;
}
```

### 2. Test Both Themes

Ensure testing both light and dark themes during development:
- Check text readability
- Confirm sufficient contrast
- Test all interactive states

### 3. Consider Images and Media

```astro
<!-- Provide different images for different themes -->
<picture>
  <source srcset="/images/logo-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="/images/logo-light.svg" alt="Logo">
</picture>
```

### 4. Use Transition Effects

```css
/* Add smooth transitions for color changes */
.element {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## 🚀 Advanced Features

### Add Theme Selector (Multi-theme Support)

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
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">Follow System</option>
    </select>
  );
}
```

### Listen for System Theme Changes

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

## 📊 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |
| classList.toggle | ✅ 8+ | ✅ 3.6+ | ✅ 5.1+ | ✅ 12+ |
| matchMedia | ✅ 9+ | ✅ 6+ | ✅ 5.1+ | ✅ 10+ |
| localStorage | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 8+ |

## 🔗 Related Resources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)

## 📝 Changelog

### v1.1.0 - 2025-11-03
- ✅ Added Dark Mode support
- ✅ Created ThemeToggle component
- ✅ Implemented theme persistence
- ✅ Added flash prevention script
- ✅ System theme preference detection
- ✅ Smooth transition animations

---

**Maintainer**: AI Agent Team  
**Last Updated**: 2025-11-03
