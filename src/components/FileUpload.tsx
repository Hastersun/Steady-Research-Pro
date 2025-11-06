import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
}

const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 1,
      name: 'research_data.csv',
      size: '2.4 MB',
      type: 'CSV',
      uploadDate: '2025-11-02',
      status: 'completed',
    },
    {
      id: 2,
      name: 'market_analysis.pdf',
      size: '5.8 MB',
      type: 'PDF',
      uploadDate: '2025-11-01',
      status: 'completed',
    },
    {
      id: 3,
      name: 'dataset_large.xlsx',
      size: '12.3 MB',
      type: 'XLSX',
      uploadDate: '2025-11-02',
      status: 'processing',
    },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log('Selected files:', Array.from(files));
    }
  };

  const getStatusBadge = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📕';
      case 'csv':
        return '📊';
      case 'xlsx':
      case 'xls':
        return '📗';
      case 'doc':
      case 'docx':
        return '📘';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            File Upload
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload and manage your research files with intelligent processing
          </p>
        </div>
        <Button size="lg" variant="outline" className="shadow-md">
          <span className="mr-2">📊</span>
          View Analytics
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-primary/30 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📤</span>
            <div>
              <CardTitle className="text-2xl">Upload Files</CardTitle>
              <CardDescription className="text-base">Supports PDF, CSV, Excel, Word and other formats</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.02]'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`text-7xl transition-transform ${isDragging ? 'scale-110' : ''}`}>
                {isDragging ? '⬇️' : '📁'}
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold">
                  {isDragging ? 'Drop to upload files' : 'Drag and drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Or click the button below to select files from your device
                </p>
              </div>
              <label htmlFor="file-upload">
                <Button size="lg" className="shadow-md" asChild>
                  <span>
                    <span className="mr-2">📂</span>
                    Select Files
                  </span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <span>✓ Max size: 50MB</span>
                <span>•</span>
                <span>✓ Multiple files</span>
                <span>•</span>
                <span>✓ Auto-processing</span>
              </div>
            </div>
          </div>

          <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <AlertTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
              <span>💡</span>
              Pro Tip
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-400">
              Upload multiple files at once for batch processing. Supported formats include PDF, CSV, XLSX, DOCX, and TXT.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upload Statistics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <span className="text-3xl opacity-80">📦</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                {uploadedFiles.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Uploaded files</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <span className="text-3xl opacity-80">💾</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                20.5 MB
              </div>
              <p className="text-xs text-muted-foreground mt-1">Storage used</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <span className="text-3xl opacity-80">⚡</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                {uploadedFiles.filter((f) => f.status === 'processing').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Files being processed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* File List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Uploaded Files</h2>
          <Button variant="outline">
            <span className="mr-2">🗑️</span>
            Clear All
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-muted-foreground">No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <Card 
                    key={file.id}
                    className="hover:shadow-md transition-all duration-300 hover:border-primary/50"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-4xl">{getFileIcon(file.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{file.name}</h3>
                              {getStatusBadge(file.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="font-mono">{file.type}</Badge>
                              <span>•</span>
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>📅 {file.uploadDate}</span>
                            </div>
                            {file.status === 'processing' && (
                              <div className="mt-3">
                                <Progress value={66} className="h-1.5" />
                                <p className="text-xs text-muted-foreground mt-1">Processing... 66%</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <span className="mr-1">⬇️</span>
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <span className="mr-1">🔍</span>
                            Analyze
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                            <span>🗑️</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUpload;
