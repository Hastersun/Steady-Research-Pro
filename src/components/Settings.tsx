import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('llama2');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  const handleSave = () => {
    console.log('Saving settings...', {
      apiKey,
      model,
      temperature,
      maxTokens,
    });
    alert('Settings saved!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your application settings and preferences
        </p>
      </div>

      {/* AI Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Settings</CardTitle>
          <CardDescription>Configure AI model parameters and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Model Selection</Label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="llama2">Llama 2</option>
              <option value="llama3">Llama 3</option>
              <option value="mistral">Mistral</option>
              <option value="codellama">Code Llama</option>
              <option value="phi">Phi</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Select the AI model to use
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperature: {temperature}
            </Label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls response randomness. Higher values make responses more creative
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens: {maxTokens}</Label>
            <input
              id="maxTokens"
              type="range"
              min="256"
              max="4096"
              step="256"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls the maximum length of generated responses
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure external APIs and services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ollama-host">Ollama Host</Label>
            <Input
              id="ollama-host"
              placeholder="http://localhost:11434"
              defaultValue="http://localhost:11434"
            />
            <p className="text-xs text-muted-foreground">
              Ollama server address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              If using a cloud service, enter your API Key
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>Personalize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Enable dark theme interface
              </p>
            </div>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive app notifications
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save your work
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset</Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Application and environment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Environment</span>
            <span className="font-mono">Development</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Node Version</span>
            <span className="font-mono">v20.11.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Build Time</span>
            <span className="font-mono">2025-11-02</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
