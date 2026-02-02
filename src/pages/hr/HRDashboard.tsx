import { useState, useEffect, useCallback } from 'react';
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
  Loader2,
} from 'lucide-react';
import { hrAPI } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

const HRDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardRes, leavesRes, expensesRes, attendanceRes] = await Promise.all([
        hrAPI.getDashboard(),
        hrAPI.getPendingLeaves(),
        hrAPI.getPendingExpenses(),
        hrAPI.getTodayAttendance(),
      ]);
      setDashboardData(dashboardRes.data.data);
      setPendingLeaves(Array.isArray(leavesRes.data.data) ? leavesRes.data.data : []);
      setPendingExpenses(Array.isArray(expensesRes.data.data) ? expensesRes.data.data : []);
      setTodayAttendance(Array.isArray(attendanceRes.data.data) ? attendanceRes.data.data : []);
    } catch (error: any) {
      console.error('Failed to fetch dashboard:', error);
      // Set empty arrays on error
      setPendingLeaves([]);
      setPendingExpenses([]);
      setTodayAttendance([]);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Employees"
            value={dashboardData?.stats?.totalEmployees || 0}
            icon={UserCircle}
            className="stagger-1"
          />
          <StatsCard
            title="Present Today"
            value={dashboardData?.stats?.presentToday || 0}
            icon={Clock}
            suffix={`/${dashboardData?.stats?.totalEmployees || 0}`}
            className="stagger-2"
          />
          <StatsCard
            title="Pending Leaves"
            value={dashboardData?.stats?.pendingLeaves || 0}
            icon={CalendarCheck}
            className="stagger-3"
          />
          <StatsCard
            title="Active Tasks"
            value={dashboardData?.stats?.activeTasks || 0}
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
                {pendingLeaves.map((leave) => {
                  const employeeName = leave.user?.name || leave.employee?.name || leave.name || 'Unknown Employee';
                  const leaveType = leave.leaveType || leave.type || 'Leave';
                  const startDate = leave.startDate || leave.from || '';
                  const endDate = leave.endDate || leave.to || '';
                  return (
                  <div
                    key={leave._id || leave.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {employeeName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {leaveType} • {leave.days} day{leave.days > 1 ? 's' : ''} • {startDate} - {endDate}
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
                  );
                })}
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
              {todayAttendance && todayAttendance.length > 0 ? (
                todayAttendance.map((emp) => (
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
              ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No attendance records for today
                </div>
              )}
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
