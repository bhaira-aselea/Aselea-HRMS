import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  ClipboardList,
  Plus,
  Calendar,
  Upload,
  Clock,
  CheckCircle,
  Circle,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  deadline: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  attachments: number;
}

const tasks: Task[] = [
  { id: '1', title: 'Complete Q4 Financial Report', description: 'Prepare and submit the quarterly financial analysis report', assignee: 'John Doe', deadline: 'Feb 5, 2026', progress: 75, status: 'in-progress', priority: 'high', attachments: 2 },
  { id: '2', title: 'Review Marketing Strategy', description: 'Analyze and provide feedback on the new marketing proposal', assignee: 'Jane Smith', deadline: 'Feb 3, 2026', progress: 30, status: 'in-progress', priority: 'medium', attachments: 1 },
  { id: '3', title: 'Update Employee Handbook', description: 'Revise policies and update the employee handbook', assignee: 'Mike Johnson', deadline: 'Feb 10, 2026', progress: 100, status: 'completed', priority: 'low', attachments: 3 },
  { id: '4', title: 'Prepare Training Materials', description: 'Create onboarding materials for new hires', assignee: 'Sarah Wilson', deadline: 'Feb 8, 2026', progress: 0, status: 'pending', priority: 'medium', attachments: 0 },
  { id: '5', title: 'Client Presentation', description: 'Prepare slides for the upcoming client meeting', assignee: 'Tom Brown', deadline: 'Feb 2, 2026', progress: 50, status: 'in-progress', priority: 'high', attachments: 4 },
];

interface TasksModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'in-progress':
      return <Timer className="h-4 w-4 text-primary" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="status-rejected">High</Badge>;
    case 'medium':
      return <Badge className="status-pending">Medium</Badge>;
    case 'low':
      return <Badge className="status-approved">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const TasksModule = ({ role }: TasksModuleProps) => {
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const canCreate = role === 'hr';

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Tasks
                </CardTitle>
                <CardDescription>Manage and track all tasks</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {canCreate && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="glow-button">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card">
                      <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>Assign a new task to an employee</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Task Title</Label>
                          <Input placeholder="Enter task title" className="bg-secondary border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea placeholder="Enter task description" className="bg-secondary border-border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Assign To</Label>
                            <Select>
                              <SelectTrigger className="bg-secondary border-border">
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="john">John Doe</SelectItem>
                                <SelectItem value="jane">Jane Smith</SelectItem>
                                <SelectItem value="mike">Mike Johnson</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select>
                              <SelectTrigger className="bg-secondary border-border">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Deadline</Label>
                          <Input type="date" className="bg-secondary border-border" />
                        </div>
                        <Button className="w-full glow-button" onClick={() => setIsDialogOpen(false)}>
                          Create Task
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{task.title}</p>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {task.assignee}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.deadline}
                          </div>
                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              {task.attachments} files
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>

                  {/* Task Actions for Employee */}
                  {role === 'employee' && task.status !== 'completed' && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-3">
                      <Button size="sm" variant="secondary" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Proof
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Update Progress
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TasksModule;
