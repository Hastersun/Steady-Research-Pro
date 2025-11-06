import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [isDragging, setIsDragging] = useState(false);
  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const [draggingFileName, setDraggingFileName] = useState<string>('');
  const [importedFileName, setImportedFileName] = useState<string>('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFileName, setExportFileName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dropZoneRef = React.useRef<HTMLDivElement>(null);

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

  // Export settings to JSON file
  const handleExport = () => {
    // Generate default filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const modelName = model.replace(/[^a-zA-Z0-9]/g, '_');
    const defaultFileName = `ai-settings_${modelName}_${dateStr}_${timeStr}`;
    
    setExportFileName(defaultFileName);
    setShowExportDialog(true);
  };

  // Confirm export with custom filename
  const handleConfirmExport = () => {
    try {
      const settings: SettingsData = {
        baseUrl,
        model,
        apiKey,
        maxTokens,
        temperature,
      };
      const jsonString = JSON.stringify(settings, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use custom filename or default
      const fileName = exportFileName.trim() || 'ai-settings';
      const finalFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
      
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Close dialog and show success feedback
      setShowExportDialog(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to export settings:', error);
      alert('导出配置失败，请重试');
    }
  };

  // Import settings from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Store the filename
    setImportedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const settings: SettingsData = JSON.parse(content);
        
        // Validate settings structure
        if (typeof settings.baseUrl !== 'string' || 
            typeof settings.model !== 'string' ||
            typeof settings.maxTokens !== 'number' ||
            typeof settings.temperature !== 'number') {
          throw new Error('Invalid settings format');
        }

        // Apply imported settings
        setBaseUrl(settings.baseUrl);
        setModel(settings.model);
        setApiKey(settings.apiKey || '');
        setMaxTokens(settings.maxTokens);
        setTemperature(settings.temperature);
        
        // Save to localStorage
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        
        // Trigger success animation
        setIsImportSuccess(true);
        setTimeout(() => setIsImportSuccess(false), 2000);
      } catch (error) {
        console.error('Failed to import settings:', error);
        alert('导入配置失败，请检查文件格式是否正确');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // Get the filename being dragged
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const item = items[0];
      if (item.kind === 'file') {
        // Note: We can't access the actual file name during dragover due to browser security
        // But we can show a generic message
        setDraggingFileName('JSON configuration file');
      }
    }
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDraggingFileName('');
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDraggingFileName('');

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    
    // Check if file is JSON
    if (!file.name.endsWith('.json')) {
      alert('请拖放JSON文件');
      return;
    }

    // Store the filename
    setImportedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const settings: SettingsData = JSON.parse(content);
        
        // Validate settings structure
        if (typeof settings.baseUrl !== 'string' || 
            typeof settings.model !== 'string' ||
            typeof settings.maxTokens !== 'number' ||
            typeof settings.temperature !== 'number') {
          throw new Error('Invalid settings format');
        }

        // Apply imported settings
        setBaseUrl(settings.baseUrl);
        setModel(settings.model);
        setApiKey(settings.apiKey || '');
        setMaxTokens(settings.maxTokens);
        setTemperature(settings.temperature);
        
        // Save to localStorage
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        
        // Trigger success animation
        setIsImportSuccess(true);
        setTimeout(() => setIsImportSuccess(false), 2000);
      } catch (error) {
        console.error('Failed to import settings:', error);
        alert('导入配置失败，请检查文件格式是否正确');
      }
    };
    reader.readAsText(file);
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
          <div className="space-y-4">
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
            
            {/* Import/Export Section */}
            <div className="border-t pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Export settings to JSON or import from a file
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImport}
                      accept=".json"
                      className="hidden"
                    />
                    <Button variant="outline" size="lg" onClick={handleImportClick}>
                      <span className="mr-2">📥</span>
                      Import from JSON
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleExport}>
                      <span className="mr-2">📤</span>
                      Export to JSON
                    </Button>
                  </div>
                </div>
                
                {/* Drag & Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative overflow-hidden
                    border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                    ${isDragging 
                      ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20' 
                      : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
                    }
                    ${isImportSuccess 
                      ? 'border-green-500 bg-green-500/10' 
                      : ''
                    }
                  `}
                >
                  {/* Animated Background Gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0
                    transition-opacity duration-500
                    ${isDragging ? 'opacity-100 animate-pulse' : 'opacity-0'}
                  `} />
                  
                  {/* Ripple Effect on Drag */}
                  {isDragging && (
                    <>
                      <div className="absolute inset-0 animate-ping opacity-20 bg-primary rounded-lg" />
                      <div className="absolute inset-4 animate-pulse opacity-30 bg-primary rounded-lg" 
                           style={{ animationDelay: '0.2s' }} />
                    </>
                  )}
                  
                  {/* Success Confetti Effect */}
                  {isImportSuccess && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce">✨</div>
                      <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</div>
                      <div className="absolute bottom-1/3 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</div>
                      <div className="absolute bottom-1/4 right-1/3 text-2xl animate-bounce" style={{ animationDelay: '0.15s' }}>✅</div>
                    </div>
                  )}
                  
                  <div className="relative flex flex-col items-center gap-3">
                    {/* Animated Icon with rotation and scale */}
                    <span className={`
                      text-5xl transition-all duration-300 inline-block
                      ${isDragging 
                        ? 'animate-bounce scale-125 rotate-12' 
                        : isImportSuccess 
                          ? 'animate-spin scale-110'
                          : 'hover:scale-110 hover:rotate-6'
                      }
                    `}>
                      {isImportSuccess ? '✅' : isDragging ? '📂' : '📄'}
                    </span>
                    
                    {/* Animated Text with breathing effect */}
                    <p className={`
                      text-base font-semibold transition-all duration-300
                      ${isDragging 
                        ? 'text-primary scale-105 animate-pulse' 
                        : isImportSuccess
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-foreground'
                      }
                    `}>
                      {isImportSuccess
                        ? '✨ Import Successful! ✨' 
                        : isDragging 
                          ? '📥 Release to import configuration' 
                          : '🎯 Drag & drop JSON file here'
                      }
                    </p>
                    
                    {/* Filename Display with animation */}
                    {(isDragging || isImportSuccess || importedFileName) && (
                      <div className={`
                        px-4 py-2 rounded-lg transition-all duration-300
                        ${isDragging 
                          ? 'bg-primary/20 border border-primary/50 animate-pulse' 
                          : isImportSuccess
                            ? 'bg-green-500/20 border border-green-500/50 scale-110'
                            : 'bg-muted border border-muted-foreground/30'
                        }
                      `}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl animate-bounce">
                            {isImportSuccess ? '📋' : isDragging ? '📄' : '✓'}
                          </span>
                          <div className="text-left">
                            <p className={`
                              text-xs font-medium transition-colors
                              ${isDragging 
                                ? 'text-primary' 
                                : isImportSuccess 
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-muted-foreground'
                              }
                            `}>
                              {isImportSuccess 
                                ? 'Imported:' 
                                : isDragging 
                                  ? 'Dragging:' 
                                  : 'Last imported:'
                              }
                            </p>
                            <p className={`
                              text-sm font-mono font-semibold transition-colors
                              ${isDragging 
                                ? 'text-primary' 
                                : isImportSuccess 
                                  ? 'text-green-700 dark:text-green-300'
                                  : 'text-foreground'
                              }
                            `}>
                              {isDragging 
                                ? draggingFileName || 'JSON file'
                                : importedFileName || 'No file imported yet'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Subtitle with fade animation */}
                    <p className={`
                      text-sm text-muted-foreground transition-all duration-300
                      ${isDragging ? 'opacity-80 scale-95' : 'opacity-100'}
                      ${isImportSuccess ? 'opacity-0' : ''}
                    `}>
                      {isDragging 
                        ? 'Drop it like it\'s hot! 🔥'
                        : 'or click the "Import from JSON" button above'
                      }
                    </p>
                    
                    {/* Animated border corners */}
                    {isDragging && (
                      <>
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary animate-pulse" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Filename Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">📤</span>
              Export Configuration
            </DialogTitle>
            <DialogDescription>
              Enter a custom name for your configuration file
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-filename" className="text-sm font-medium">
                File Name
              </Label>
              <Input
                id="export-filename"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                placeholder="ai-settings"
                className="font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmExport();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                File will be saved as: <span className="font-mono font-semibold">{exportFileName || 'ai-settings'}.json</span>
              </p>
            </div>
            
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Current Settings:</p>
              <div className="text-xs space-y-0.5 font-mono">
                <p>• Model: <span className="font-semibold text-foreground">{model}</span></p>
                <p>• Base URL: <span className="font-semibold text-foreground">{baseUrl}</span></p>
                <p>• Max Tokens: <span className="font-semibold text-foreground">{maxTokens}</span></p>
                <p>• Temperature: <span className="font-semibold text-foreground">{temperature}</span></p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmExport} className="gap-2">
              <span>💾</span>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
