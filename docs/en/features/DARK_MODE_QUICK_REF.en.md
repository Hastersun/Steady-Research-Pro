# Dark Mode Quick Reference

## 🚀 5-Second Quick Start

The theme toggle button is in the top-right corner. Click to switch!

## 📍 Component Locations

```
src/
├── components/
│   └── ThemeToggle.tsx          # Theme toggle component
├── layouts/
│   └── Layout.astro             # Integrated theme switching
└── styles/
    └── globals.css              # Theme color configuration
```

## 💻 Quick Usage

### Use in New Pages

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout title="My Page">
  <div class="bg-white dark:bg-gray-900 p-4">
    <h1 class="text-black dark:text-white">Title</h1>
  </div>
</Layout>
```

### Add Dark Styles

Use Tailwind's `dark:` prefix:

```html
<!-- Background -->
<div class="bg-white dark:bg-gray-900">

<!-- Text Color -->
<p class="text-gray-900 dark:text-gray-100">

<!-- Border -->
<div class="border border-gray-200 dark:border-gray-700">

<!-- Hover State -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">
```

## 🎨 Common Color Combinations

### Backgrounds
```css
bg-white dark:bg-gray-900          # Page background
bg-gray-50 dark:bg-gray-800        # Card background
bg-gray-100 dark:bg-gray-700       # Secondary background
```

### Text
```css
text-gray-900 dark:text-gray-100   # Primary text
text-gray-600 dark:text-gray-400   # Secondary text
text-gray-500 dark:text-gray-500   # Placeholder text
```

### Borders
```css
border-gray-200 dark:border-gray-700   # Border
border-gray-300 dark:border-gray-600   # Emphasized border
```

## 🔧 Customize Theme Colors

Edit `src/styles/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;     /* Your primary color */
}

.dark {
  --primary: 210 40% 98%;           /* Dark theme primary color */
}
```

## 📱 Detect Theme in React Components

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

## ⌨️ Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Quick Debugging

### Issue: Toggle not working

**Check**:
1. Tailwind config has `darkMode: ["class"]`
2. Component uses `client:load` directive
3. No errors in browser console

### Issue: Page flashing on load

**Solution**:
Ensure `Layout.astro` has the anti-flash script in `<head>`:

```astro
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>
```

## 📊 Color Variables Quick Reference

| Variable | Usage |
|----------|-------|
| `--background` | Page background |
| `--foreground` | Text color |
| `--primary` | Primary button/link |
| `--secondary` | Secondary elements |
| `--muted` | Muted elements |
| `--accent` | Accent elements |
| `--destructive` | Danger/delete actions |
| `--border` | Border color |

## 🎯 Usage Tips

1. **Use Semantic Colors**
   ```html
   <button class="bg-primary text-primary-foreground">
   ```

2. **Test Contrast**
   Use browser dev tools to check color contrast meets WCAG standards

3. **Progressive Enhancement**
   Ensure it works in browsers without dark mode support

4. **Performance**
   Theme switching uses CSS variables, no page reload needed

## 🔗 Related Documentation

- [Complete Guide](./DARK_MODE_GUIDE.md)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

**Quick Questions?** Check [complete documentation](./DARK_MODE_GUIDE.md) or file an issue
