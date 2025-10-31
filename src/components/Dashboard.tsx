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
        {' '}与上月相比
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
      title: '总收入',
      value: '¥45,231',
      change: '+20.1%',
      changeType: 'increase' as const,
      icon: '💰',
    },
    {
      title: '活跃用户',
      value: '2,350',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: '👥',
    },
    {
      title: '订单数',
      value: '892',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: '📦',
    },
    {
      title: '转化率',
      value: '3.2%',
      change: '-2.4%',
      changeType: 'decrease' as const,
      icon: '📈',
    },
  ];

  const recentActivities: Activity[] = [
    {
      id: 1,
      user: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      action: '完成了新订单 #1234',
      time: '5分钟前',
      status: 'success',
    },
    {
      id: 2,
      user: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      action: '更新了个人资料',
      time: '15分钟前',
      status: 'success',
    },
    {
      id: 3,
      user: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine',
      action: '提交了退款请求',
      time: '1小时前',
      status: 'warning',
    },
    {
      id: 4,
      user: '赵六',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      action: '注册新账户',
      time: '2小时前',
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
      success: '成功',
      pending: '进行中',
      warning: '警告',
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
        <Button variant="outline">📥 导出报告</Button>
        <Button>🔄 刷新数据</Button>
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
            <CardTitle>收入概览</CardTitle>
            <CardDescription>近6个月的收入趋势</CardDescription>
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
              <span>5月</span>
              <span>6月</span>
              <span>7月</span>
              <span>8月</span>
              <span>9月</span>
              <span>10月</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>用户最新的操作记录</CardDescription>
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
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能快捷入口</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">➕ 创建新订单</Button>
            <Button className="w-full" variant="outline">👤 管理用户</Button>
            <Button className="w-full" variant="outline">⚙️ 系统设置</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>服务运行情况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">数据库</span>
              <Badge variant="default">正常</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API 服务</span>
              <Badge variant="default">正常</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">存储空间</span>
              <Badge variant="secondary">78% 使用</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>待办事项</CardTitle>
            <CardDescription>需要处理的任务</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">审核待处理订单</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">回复客户咨询</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">更新产品库存</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">生成月度报表</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
