import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function WebScraper() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleScrape = async () => {
    if (!url) {
      setError('请输入有效的 URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setScrapedData('');
    setProgress(10);

    try {
      // 模拟爬取过程
      setProgress(30);
      
      // TODO: 实际的 API 调用将在这里实现
      // const response = await fetch('/api/scrape', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url })
      // });
      
      setProgress(60);
      
      // 模拟数据
      setTimeout(() => {
        setProgress(100);
        setScrapedData(`成功爬取网页: ${url}\n\n这是一个示例输出。实际的爬虫功能需要后端 API 支持。`);
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : '爬取失败');
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setUrl('');
    setScrapedData('');
    setError('');
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🕸️</span>
            URL 输入
          </CardTitle>
          <CardDescription>
            输入要爬取的网页 URL
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
              onClick={handleScrape} 
              disabled={isLoading || !url}
              className="min-w-[100px]"
            >
              {isLoading ? '爬取中...' : '开始爬取'}
            </Button>
            <Button 
              onClick={handleClear} 
              variant="outline"
              disabled={isLoading}
            >
              清空
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
        </CardContent>
      </Card>

      {scrapedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                爬取结果
              </span>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                成功
              </Badge>
            </CardTitle>
            <CardDescription>
              提取的网页内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={scrapedData}
              readOnly
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigator.clipboard.writeText(scrapedData)}
              >
                📋 复制到剪贴板
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const blob = new Blob([scrapedData], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'scraped-data.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                💾 下载结果
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            使用提示
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 确保输入完整的 URL（包含 http:// 或 https://）</p>
          <p>• 某些网站可能有反爬虫机制，可能无法成功爬取</p>
          <p>• 大型网页可能需要较长时间处理</p>
          <p>• 请遵守网站的 robots.txt 和使用条款</p>
        </CardContent>
      </Card>
    </div>
  );
}
