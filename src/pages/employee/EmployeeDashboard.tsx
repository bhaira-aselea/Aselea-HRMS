import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  CalendarCheck,
  ClipboardList,
  Receipt,
  MapPin,
  CheckCircle,
  Timer,
  Megaphone,
} from 'lucide-react';

const myTasks = [
  { id: 1, title: 'Complete Q4 Report', progress: 75, status: 'in-progress', deadline: 'Feb 5' },
  { id: 2, title: 'Review client proposals', progress: 30, status: 'in-progress', deadline: 'Feb 3' },
  { id: 3, title: 'Team meeting preparation', progress: 100, status: 'completed', deadline: 'Feb 1' },
  { id: 4, title: 'Update documentation', progress: 0, status: 'pending', deadline: 'Feb 7' },
];

const announcements = [
  { id: 1, title: 'Office Closed for Maintenance', date: 'Feb 15', priority: 'high' },
  { id: 2, title: 'New Health Insurance Benefits', date: 'Feb 10', priority: 'medium' },
  { id: 3, title: 'Team Building Event', date: 'Feb 20', priority: 'low' },
];

const EmployeeDashboard = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);

  const handlePunch = () => {
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsPunchedIn(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Welcome & Punch Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Punch In/Out Card */}
          <Card className="lg:col-span-2 glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Good Morning, Bhaira!</h2>
                  <p className="text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {isPunchedIn && punchTime && (
                    <div className="flex items-center gap-2 mt-3 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Punched in at {punchTime}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={handlePunch}
                    size="lg"
                    className={`glow-button h-20 w-40 text-lg font-semibold ${
                      isPunchedIn ? 'bg-destructive hover:bg-destructive/90' : ''
                    }`}
                  >
                    {isPunchedIn ? (
                      <>
                        <Timer className="h-5 w-5 mr-2" />
                        Punch Out
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 mr-2" />
                        Punch In
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Location: Office - Main Building</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
/* Today's Status */
          {/* Today's Status */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Today's Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Working Hours</span>
                  <span className="text-sm font-medium text-foreground">
                    {isPunchedIn ? '4h 32m' : '0h 0m'}
                  </span>
                </div>
                <Progress value={isPunchedIn ? 56 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h</span>
                  <span>8h target</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Leave Balance"
            value={12}
            icon={CalendarCheck}
            suffix=" days"
            className="stagger-1"
          />
          <StatsCard
            title="Active Tasks"
            value={4}
            icon={ClipboardList}
            className="stagger-2"
          />
          <StatsCard
            title="Pending Expenses"
            value={2}
            icon={Receipt}
            className="stagger-3"
          />
          <StatsCard
            title="This Month Attendance"
            value={92}
            icon={Clock}
            suffix="%"
            className="stagger-4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                My Tasks
              </CardTitle>
              <CardDescription>Your assigned tasks and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          task.status === 'completed' ? 'status-approved' :
                          task.status === 'in-progress' ? 'status-in-progress' : 'status-pending'
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Announcements
              </CardTitle>
              <CardDescription>Latest company updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-lg bg-secondary/50 border-l-4 border-primary"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          announcement.priority === 'high' ? 'status-rejected' :
                          announcement.priority === 'medium' ? 'status-pending' : 'status-approved'
                        }
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leave Balance Summary */}
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="text-sm font-medium text-foreground mb-3">Leave Balance</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-foreground">5</p>
                    <p className="text-xs text-muted-foreground">Casual</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">4</p>
                    <p className="text-xs text-muted-foreground">Sick</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Annual</p>
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

export default EmployeeDashboard;
