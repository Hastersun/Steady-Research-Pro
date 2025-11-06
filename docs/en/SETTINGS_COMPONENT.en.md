# Settings Component Documentation

## 📋 Overview

The Settings component provides a clean configuration interface for managing AI model parameters and API settings. All configurations are persistently saved to the browser's localStorage.

**Version**: v2.0.0  
**Last Updated**: 2025-11-06

## 🎯 Core Features

### 1. Configuration Management

#### Configuration Items

| Item | Type | Default | Description |
|--------|------|--------|------|
| **Base URL** | URL | `http://localhost:11434` | Base URL of AI service |
| **Model** | string | `llama2` | AI model name to use |
| **API Key** | password | `` | API key (optional) |
| **Max Tokens** | number | `2048` | Maximum tokens to generate (256-4096) |
| **Temperature** | number | `0.7` | Temperature parameter (0.0-2.0) |

### 2. Persistent Storage

- **Storage Location**: `localStorage`
- **Storage Key**: `'ai-settings'`
- **Format**: JSON

```typescript
interface SettingsData {
  baseUrl: string;
  model: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
}
```

### 3. Auto Loading

- Automatically reads saved configuration from localStorage on page load
- Uses default values if no saved configuration exists
- Error handling: Falls back to defaults if reading fails

## 🎨 UI Components

### Reusable Abstract Components

#### TextInput (`src/components/TextInput.tsx`)

Generic text input component supporting multiple input types.

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
- `id`: string - Unique identifier for input
- `label`: string - Label text to display
- `value`: string - Current value (controlled)
- `defaultValue`: string - Default value (uncontrolled)
- `placeholder`: string - Placeholder text
- `onChange`: (value: string) => void - Value change callback
- `type`: 'text' | 'password' | 'email' | 'url' - Input type

#### SliderWithInput (`src/components/SliderWithInput.tsx`)

Hybrid component combining slider and numeric input, suitable for numeric range selection.

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
- `id`: string - Component unique identifier
- `label`: string - Label text to display
- `value`: number - Current value
- `onChange`: (value: number) => void - Value change callback
- `min`: number - Minimum value
- `max`: number - Maximum value
- `step`: number - Step value
- `showLabels`: boolean - Whether to show scale labels (default true)

**Features**:
- Auto-detects decimal type (step < 1)
- Bidirectional sync between slider and input
- Displays min, middle, and max scale values
- Supports integer and decimal formatting

## 💾 Action Buttons

### Save Settings
- **Function**: Save current configuration to localStorage
- **Feedback**: Shows "Saved!" message (auto-disappears after 3 seconds)
- **Shortcut**: None

### Reset to Defaults
- **Function**: Reset all configurations to default values and clear localStorage
- **Confirmation**: No confirmation dialog, executes immediately
- **Impact**: All configurations restored to initial state

## 📁 File Structure

```
src/
├── components/
│   ├── Settings.tsx          # Main settings component
│   ├── TextInput.tsx         # Text input component
│   └── SliderWithInput.tsx   # Slider input component
└── pages/
    └── settings.astro        # Settings page
```

## 🔧 Usage Examples

### Using in Astro Pages

```astro
---
import Layout from '@/layouts/Layout.astro';
import Settings from '@/components/Settings.tsx';
---

<Layout title="Settings" activePage="settings">
  <Settings client:load />
</Layout>
```

### Reading Saved Configuration

```typescript
// Read configuration in other components
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

## 🎯 Best Practices

### 1. Configuration Validation
While the component has basic type checking internally, validation before using configuration is recommended:

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

### 2. Security Considerations
- API Key uses password input type to avoid plaintext display
- localStorage is relatively secure under same-origin policy protection
- Sensitive data should be encrypted for storage (not implemented)

### 3. User Experience
- All inputs are controlled components ensuring state consistency
- Clear visual feedback on successful save
- Reset operation may need confirmation dialog

## 🚀 Future Improvements

- [ ] Add configuration export/import functionality
- [ ] Configuration validation and error messages
- [ ] Confirmation dialog for reset operation
- [ ] Support multiple configuration profiles
- [ ] Encrypted configuration storage
- [ ] Sync configuration with backend

## 📝 Change History

### v2.0.0 (2025-11-06)
- Refactored to single AI Configuration card
- Removed tab structure (previously had AI Model, API, Preferences, System tabs)
- Extracted TextInput and SliderWithInput as reusable components
- Implemented localStorage persistence
- Added Save and Reset functionality
- Changed all inputs to controlled components

### v1.0.0
- Initial version
- Multi-tab structure
- Basic configuration items
