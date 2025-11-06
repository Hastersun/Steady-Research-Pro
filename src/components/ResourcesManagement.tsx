import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface Resource {
  id: number;
  name: string;
  type: 'file' | 'url';
  source: string; // 文件路径或 URL
  size?: string;
  fileType?: string;
  addedDate: string;
  status: 'processing' | 'completed' | 'failed';
}

export default function ResourcesManagement() {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      name: 'research_data.csv',
      type: 'file',
      source: '/uploads/research_data.csv',
      size: '2.4 MB',
      fileType: 'CSV',
      addedDate: '2025-11-02',
      status: 'completed',
    },
    {
      id: 2,
      name: 'TechCrunch Article',
      type: 'url',
      source: 'https://techcrunch.com/article/example',
      addedDate: '2025-11-03',
      status: 'completed',
    },
    {
      id: 3,
      name: 'market_analysis.pdf',
      type: 'file',
      source: '/uploads/market_analysis.pdf',
      size: '5.8 MB',
      fileType: 'PDF',
      addedDate: '2025-11-01',
      status: 'completed',
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
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const newResource: Resource = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: 'file',
        source: `/uploads/${file.name}`,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        addedDate: new Date().toISOString().split('T')[0],
        status: 'processing',
      };
      
      setResources((prev) => [newResource, ...prev]);
      
      // 模拟上传完成
      setTimeout(() => {
        setResources((prev) =>
          prev.map((r) => (r.id === newResource.id ? { ...r, status: 'completed' as const } : r))
        );
      }, 2000);
    });
  };

  const handleUrlScrape = async () => {
    if (!url) {
      setError('请输入有效的 URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setProgress(10);

    try {
      setProgress(30);
      
      const newResource: Resource = {
        id: Date.now(),
        name: new URL(url).hostname,
        type: 'url',
        source: url,
        addedDate: new Date().toISOString().split('T')[0],
        status: 'processing',
      };
      
      setResources((prev) => [newResource, ...prev]);
      
      setProgress(60);
      
      // 模拟爬取完成
      setTimeout(() => {
        setProgress(100);
        setResources((prev) =>
          prev.map((r) => (r.id === newResource.id ? { ...r, status: 'completed' as const } : r))
        );
        setIsLoading(false);
        setUrl('');
        setProgress(0);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : '爬取失败');
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleDelete = (id: number) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const getResourceIcon = (resource: Resource) => {
    if (resource.type === 'url') return '🌐';
    if (resource.fileType === 'PDF') return '📄';
    if (resource.fileType === 'CSV') return '📊';
    if (resource.fileType === 'XLSX' || resource.fileType === 'XLS') return '📈';
    if (resource.fileType === 'TXT') return '📝';
    return '📁';
  };

  const getStatusBadge = (status: Resource['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">完成</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">处理中</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">失败</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Resources Management
        </h1>
        <p className="text-muted-foreground mt-2">
          统一管理文件上传和网页数据抓取
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 文件上传区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📤</span>
              文件上传
            </CardTitle>
            <CardDescription>
              拖拽文件到此处或点击选择文件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              <div className="space-y-4">
                <div className="text-5xl">📁</div>
                <div>
                  <p className="text-lg font-medium">拖拽文件到此处</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    支持 CSV, PDF, XLSX, TXT 等格式
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>选择文件</span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL 爬取区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🕸️</span>
              URL 爬取
            </CardTitle>
            <CardDescription>
              输入网页 URL 进行数据抓取
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleUrlScrape} 
                disabled={isLoading || !url}
                className="min-w-[100px]"
              >
                {isLoading ? '爬取中...' : '开始爬取'}
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">爬取进度</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">❌ {error}</p>
              </div>
            )}

            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">💡 使用提示：</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>确保输入完整的 URL</li>
                <li>遵守网站的使用条款</li>
                <li>大型网页可能需要较长时间</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 统一的资源列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">�</span>
              所有资源
            </span>
            <Badge variant="outline" className="text-base">
              {resources.length} 项
            </Badge>
          </CardTitle>
          <CardDescription>
            文件和网页数据的统一管理视图
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-5xl mb-4">📭</div>
                <p>还没有任何资源</p>
                <p className="text-sm mt-1">上传文件或爬取网页开始使用</p>
              </div>
            ) : (
              resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">
                      {getResourceIcon(resource)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{resource.name}</p>
                        {getStatusBadge(resource.status)}
                        <Badge variant="secondary" className="text-xs">
                          {resource.type === 'file' ? '📁 文件' : '🌐 URL'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                        {resource.size && <span>📦 {resource.size}</span>}
                        {resource.fileType && <span>• {resource.fileType}</span>}
                        <span>• 📅 {resource.addedDate}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {resource.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {resource.type === 'url' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(resource.source, '_blank')}
                      >
                        🔗 访问
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                    >
                      🗑️ 删除
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
