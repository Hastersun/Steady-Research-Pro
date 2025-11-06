import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SliderWithInput from '@/components/SliderWithInput';
import TextInput from '@/components/TextInput';

interface SettingsData {
  baseUrl: string;
  model: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_SETTINGS: SettingsData = {
  baseUrl: 'http://localhost:11434',
  model: 'llama2',
  apiKey: '',
  maxTokens: 2048,
  temperature: 0.7,
};

const SETTINGS_KEY = 'ai-settings';

const Settings: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_SETTINGS.baseUrl);
  const [model, setModel] = useState(DEFAULT_SETTINGS.model);
  const [apiKey, setApiKey] = useState(DEFAULT_SETTINGS.apiKey);
  const [maxTokens, setMaxTokens] = useState(DEFAULT_SETTINGS.maxTokens);
  const [temperature, setTemperature] = useState(DEFAULT_SETTINGS.temperature);
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          const settings: SettingsData = JSON.parse(savedSettings);
          setBaseUrl(settings.baseUrl);
          setModel(settings.model);
          setApiKey(settings.apiKey);
          setMaxTokens(settings.maxTokens);
          setTemperature(settings.temperature);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings to localStorage
  const handleSave = () => {
    try {
      const settings: SettingsData = {
        baseUrl,
        model,
        apiKey,
        maxTokens,
        temperature,
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Reset to default settings
  const handleReset = () => {
    setBaseUrl(DEFAULT_SETTINGS.baseUrl);
    setModel(DEFAULT_SETTINGS.model);
    setApiKey(DEFAULT_SETTINGS.apiKey);
    setMaxTokens(DEFAULT_SETTINGS.maxTokens);
    setTemperature(DEFAULT_SETTINGS.temperature);
    localStorage.removeItem(SETTINGS_KEY);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Configure your application settings and preferences
          </p>
        </div>
        {saved && (
          <div className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
            <span>✓</span>
            Saved!
          </div>
        )}
      </div>

      {/* AI Configuration */}
      <Card className="border-2 hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <div>
              <CardTitle className="text-2xl">AI Configuration</CardTitle>
              <CardDescription className="text-base">Configure AI model parameters and API settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <TextInput
            id="base-url"
            label="Base URL"
            placeholder="http://localhost:11434"
            value={baseUrl}
            onChange={setBaseUrl}
            type="url"
          />

          <TextInput
            id="model"
            label="Model"
            placeholder="llama2"
            value={model}
            onChange={setModel}
            type="text"
          />

          <TextInput
            id="api-key"
            label="API Key"
            placeholder="Enter your API Key (Optional)"
            value={apiKey}
            onChange={setApiKey}
            type="password"
          />

          <SliderWithInput
            id="maxTokens"
            label="Max Tokens"
            value={maxTokens}
            onChange={setMaxTokens}
            min={256}
            max={4096}
            step={256}
          />

          <SliderWithInput
            id="temperature"
            label="Temperature"
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={2}
            step={0.1}
          />
        </CardContent>
      </Card>

      {/* Save Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Changes are saved locally in your browser
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={handleReset}>
                <span className="mr-2">↺</span>
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} size="lg" className="shadow-md">
                <span className="mr-2">💾</span>
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
