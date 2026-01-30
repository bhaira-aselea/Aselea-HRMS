import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  UserCircle,
  Clock,
  CalendarCheck,
  ClipboardList,
  Receipt,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock3,
} from 'lucide-react';

const pendingLeaves = [
  { id: 1, name: 'John Doe', type: 'Sick Leave', days: 2, from: 'Feb 1', to: 'Feb 2' },
  { id: 2, name: 'Jane Smith', type: 'Casual Leave', days: 1, from: 'Feb 3', to: 'Feb 3' },
  { id: 3, name: 'Mike Johnson', type: 'Annual Leave', days: 5, from: 'Feb 10', to: 'Feb 14' },
];

const pendingExpenses = [
  { id: 1, name: 'Sarah Wilson', amount: 245, description: 'Client lunch meeting', date: 'Jan 28' },
  { id: 2, name: 'Tom Brown', amount: 120, description: 'Office supplies', date: 'Jan 29' },
  { id: 3, name: 'Emily Davis', amount: 380, description: 'Travel reimbursement', date: 'Jan 30' },
];

const todayAttendance = [
  { id: 1, name: 'John Doe', status: 'present', punchIn: '09:00 AM', punchOut: '-' },
  { id: 2, name: 'Jane Smith', status: 'present', punchIn: '08:45 AM', punchOut: '-' },
  { id: 3, name: 'Mike Johnson', status: 'late', punchIn: '10:15 AM', punchOut: '-' },
  { id: 4, name: 'Sarah Wilson', status: 'absent', punchIn: '-', punchOut: '-' },
];

const HRDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Employees"
            value={86}
            icon={UserCircle}
            trend={{ value: 4, isPositive: true }}
            className="stagger-1"
          />
          <StatsCard
            title="Present Today"
            value={72}
            icon={Clock}
            suffix="/86"
            className="stagger-2"
          />
          <StatsCard
            title="Pending Leaves"
            value={8}
            icon={CalendarCheck}
            className="stagger-3"
          />
          <StatsCard
            title="Active Tasks"
            value={34}
            icon={ClipboardList}
            className="stagger-4"
          />
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="glow-button">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="secondary">
                <ClipboardList className="h-4 w-4 mr-2" />
                Create Task
              </Button>
              <Button variant="secondary">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
              <Button variant="secondary">
                <Receipt className="h-4 w-4 mr-2" />
                Review Expenses
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Pending Leave Requests
              </CardTitle>
              <CardDescription>Requests awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {leave.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{leave.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {leave.type} • {leave.days} day{leave.days > 1 ? 's' : ''} • {leave.from} - {leave.to}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-success hover:text-success hover:bg-success/10">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Expenses */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Pending Expenses
              </CardTitle>
              <CardDescription>Expense claims for review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {expense.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">${expense.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {expense.name} • {expense.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-success hover:text-success hover:bg-success/10">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Attendance
            </CardTitle>
            <CardDescription>Real-time attendance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayAttendance.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{emp.name}</p>
                      <Badge
                        variant="outline"
                        className={
                          emp.status === 'present' ? 'status-approved' :
                          emp.status === 'late' ? 'status-pending' : 'status-rejected'
                        }
                      >
                        {emp.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>In: {emp.punchIn}</span>
                    <span>Out: {emp.punchOut}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance Summary */}
            <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-success">72</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">5</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">4</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">5</p>
                  <p className="text-xs text-muted-foreground">On Leave</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HRDashboard;
