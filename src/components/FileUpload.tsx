import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your research files
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Supports PDF, CSV, Excel, Word and other formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl">📁</div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {isDragging ? 'Drop to upload files' : 'Drag and drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Or click the button to select files
                </p>
              </div>
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>Select Files</span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Supports files up to 50MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadedFiles.length}</div>
            <p className="text-xs text-muted-foreground">Uploaded files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <span className="text-2xl">💾</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20.5 MB</div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <span className="text-2xl">⚡</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadedFiles.filter((f) => f.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Files being processed</p>
          </CardContent>
        </Card>
      </div>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>Manage all your uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{getFileIcon(file.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{file.name}</h3>
                      {getStatusBadge(file.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.type}</span>
                      <span>•</span>
                      <span>{file.uploadDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    Analyze
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
