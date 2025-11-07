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
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setScrapedData('');
    setProgress(10);

    try {
      // Simulate scraping process
      setProgress(30);
      
      // TODO: Actual API call will be implemented here
      // const response = await fetch('/api/scrape', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url })
      // });
      
      setProgress(60);
      
      // Simulated data
      setTimeout(() => {
        setProgress(100);
        setScrapedData(`Successfully scraped webpage: ${url}\n\nThis is a sample output. Actual scraping functionality requires backend API support.`);
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scraping failed');
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
            URL Input
          </CardTitle>
          <CardDescription>
            Enter the webpage URL to scrape
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
              {isLoading ? 'Scraping...' : 'Start Scraping'}
            </Button>
            <Button 
              onClick={handleClear} 
              variant="outline"
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scraping Progress</span>
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
                Scraping Results
              </span>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                Success
              </Badge>
            </CardTitle>
            <CardDescription>
              Extracted webpage content
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
                📋 Copy to Clipboard
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
                💾 Download Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Usage Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Make sure to enter a complete URL (including http:// or https://)</p>
          <p>• Some websites may have anti-scraping mechanisms and may not be successfully scraped</p>
          <p>• Large webpages may take longer to process</p>
          <p>• Please respect the website's robots.txt and terms of use</p>
        </CardContent>
      </Card>
    </div>
  );
}
