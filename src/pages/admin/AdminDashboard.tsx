import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Users,
  UserCircle,
  Clock,
  CalendarCheck,
  ClipboardList,
  Receipt,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const recentActivities = [
  { id: 1, action: 'New employee onboarded', user: 'HR Team', time: '2 min ago', type: 'success' },
  { id: 2, action: 'Leave request approved', user: 'John Doe', time: '15 min ago', type: 'info' },
  { id: 3, action: 'Expense claim submitted', user: 'Jane Smith', time: '1 hour ago', type: 'warning' },
  { id: 4, action: 'Task completed', user: 'Mike Johnson', time: '2 hours ago', type: 'success' },
  { id: 5, action: 'Attendance anomaly detected', user: 'System', time: '3 hours ago', type: 'error' },
];

const systemAlerts = [
  { id: 1, message: '5 pending leave requests require approval', priority: 'high' },
  { id: 2, message: '12 expense claims awaiting review', priority: 'medium' },
  { id: 3, message: 'Monthly attendance report ready', priority: 'low' },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Companies"
            value={12}
            icon={Building2}
            trend={{ value: 8, isPositive: true }}
            className="stagger-1"
          />
          <StatsCard
            title="HR Managers"
            value={24}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            className="stagger-2"
          />
          <StatsCard
            title="Total Employees"
            value={458}
            icon={UserCircle}
            trend={{ value: 5, isPositive: true }}
            className="stagger-3"
          />
          <StatsCard
            title="Active Today"
            value={312}
            icon={Clock}
            suffix="/458"
            className="stagger-4"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Pending Leaves"
            value={23}
            icon={CalendarCheck}
            className="stagger-5"
          />
          <StatsCard
            title="Active Tasks"
            value={89}
            icon={ClipboardList}
            className="stagger-6"
          />
          <StatsCard
            title="Pending Expenses"
            value={34}
            icon={Receipt}
            prefix="$"
            className="stagger-6"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'success' ? 'bg-success' :
                      activity.type === 'error' ? 'bg-destructive' :
                      activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                System Alerts
              </CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-secondary/30"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{alert.message}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        alert.priority === 'high' ? 'status-rejected' :
                        alert.priority === 'medium' ? 'status-pending' : 'status-approved'
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* System Health */}
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium text-foreground">System Health</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Server Load</span>
                      <span className="text-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Database</span>
                      <span className="text-foreground">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="text-foreground">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
