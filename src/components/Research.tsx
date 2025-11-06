import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-3xl opacity-80">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        <span className={`font-semibold ${changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {changeType === 'increase' ? '↑' : '↓'} {change}
        </span>
        {' '}compared to last month
      </p>
    </CardContent>
  </Card>
);

const Research: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    {
      title: 'Research Projects',
      value: '24',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: '🔬',
    },
    {
      title: 'Data Analysis',
      value: '156',
      change: '+23.1%',
      changeType: 'increase' as const,
      icon: '📊',
    },
    {
      title: 'Reports Generated',
      value: '89',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: '📄',
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+3.2%',
      changeType: 'increase' as const,
      icon: '✅',
    },
  ];

  const recentResearch = [
    {
      id: 1,
      title: 'Market Trend Analysis Report',
      status: 'In Progress',
      progress: 75,
      date: '2025-11-01',
      badge: 'warning',
    },
    {
      id: 2,
      title: 'Competitive Analysis Report',
      status: 'Completed',
      progress: 100,
      date: '2025-10-28',
      badge: 'success',
    },
    {
      id: 3,
      title: 'User Behavior Research',
      status: 'Not Started',
      progress: 0,
      date: '2025-11-05',
      badge: 'secondary',
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Research Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage and track your research projects with AI-powered insights
          </p>
        </div>
        <Button size="lg" className="shadow-lg">
          <span className="mr-2">✨</span>
          New Project
        </Button>
      </div>

      {/* AI Research Assistant */}
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <div>
              <CardTitle className="text-2xl">AI Research Assistant</CardTitle>
              <CardDescription className="text-base">Use AI for in-depth research and data analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-base font-semibold">Enter research topic or question</Label>
              <Input
                id="search"
                placeholder="For example: Analyze e-commerce market trends in 2024..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2 h-12 text-base"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery}
                size="lg"
                className="flex-1 shadow-md hover:shadow-lg transition-shadow"
              >
                {isSearching ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Start Research
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <span className="mr-2">📋</span>
                Templates
              </Button>
            </div>
          </div>

          {isSearching && (
            <Alert className="mt-4 border-primary/50 bg-primary/5">
              <AlertTitle className="flex items-center gap-2">
                <span className="animate-pulse">🔍</span>
                AI is analyzing your request...
              </AlertTitle>
              <AlertDescription>
                This may take a few moments. We're gathering the best insights for you.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Overview Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Recent Research with Tabs */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Research Projects</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {recentResearch.map((item) => (
                <Card 
                  key={item.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <Badge 
                            variant={item.badge as any}
                            className="shadow-sm"
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Progress: {item.progress}%</span>
                            <span>•</span>
                            <span>📅 {item.date}</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <span className="mr-1">👁️</span>
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <span>⋮</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inprogress" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Filter by in-progress projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Filter by completed projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Filter by pending projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Research;
