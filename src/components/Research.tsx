import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <span className="text-2xl">{icon}</span>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        <span className={changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your research projects
        </p>
      </div>

      {/* Search Area */}
      <Card>
        <CardHeader>
          <CardTitle>AI Research Assistant</CardTitle>
          <CardDescription>Use AI for in-depth research and data analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Enter research topic or question</Label>
              <Input
                id="search"
                placeholder="For example: Analyze e-commerce market trends in 2024..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !searchQuery}
            className="mt-4"
          >
            {isSearching ? '🔍 Searching...' : '🚀 Start Research'}
          </Button>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Research */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Research Projects</CardTitle>
          <CardDescription>View your recently created and modified research projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentResearch.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant={item.badge as any}>{item.status}</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Progress: {item.progress}%</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Research;
