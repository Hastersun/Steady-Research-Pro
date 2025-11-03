import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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

interface Activity {
  id: number;
  user: string;
  avatar: string;
  action: string;
  time: string;
  status: 'success' | 'pending' | 'warning';
}

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '¥45,231',
      change: '+20.1%',
      changeType: 'increase' as const,
      icon: '💰',
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: '👥',
    },
    {
      title: 'Orders',
      value: '892',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: '📦',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2.4%',
      changeType: 'decrease' as const,
      icon: '📈',
    },
  ];

  const recentActivities: Activity[] = [
    {
      id: 1,
      user: 'Zhang San',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      action: 'Completed new order #1234',
      time: '5 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      user: 'Li Si',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      action: 'Updated profile',
      time: '15 minutes ago',
      status: 'success',
    },
    {
      id: 3,
      user: 'Wang Wu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine',
      action: 'Submitted refund request',
      time: '1 hour ago',
      status: 'warning',
    },
    {
      id: 4,
      user: 'Zhao Liu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      action: 'Registered new account',
      time: '2 hours ago',
      status: 'success',
    },
  ];

  const getStatusBadge = (status: Activity['status']) => {
    const variants = {
      success: 'default',
      pending: 'secondary',
      warning: 'destructive',
    };
    const labels = {
      success: 'Success',
      pending: 'In Progress',
      warning: 'Warning',
    };
    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline">📥 Export Report</Button>
        <Button>🔄 Refresh Data</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Overview Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue trends for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-end justify-around gap-2 px-4">
              {[45, 60, 35, 75, 50, 85].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary rounded-t-md transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                  title={`${height}%`}
                />
              ))}
            </div>
            <div className="flex justify-around mt-4 text-xs text-muted-foreground">
              <span>May</span>
              <span>June</span>
              <span>July</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{activity.user}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Quick access to common functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">➕ Create New Order</Button>
            <Button className="w-full" variant="outline">👤 Manage Users</Button>
            <Button className="w-full" variant="outline">⚙️ System Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Service health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default">Normal</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Service</span>
              <Badge variant="default">Normal</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <Badge variant="secondary">78% Used</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To-Do List</CardTitle>
            <CardDescription>Tasks that need attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Review pending orders</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Reply to customer inquiries</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Update product inventory</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Generate monthly report</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
