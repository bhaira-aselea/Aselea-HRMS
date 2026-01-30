import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  CalendarCheck,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

const leaveRequests: LeaveRequest[] = [
  { id: '1', employeeName: 'John Doe', type: 'Sick Leave', from: 'Feb 1', to: 'Feb 2', days: 2, reason: 'Medical appointment', status: 'pending', appliedOn: 'Jan 28' },
  { id: '2', employeeName: 'Jane Smith', type: 'Casual Leave', from: 'Feb 5', to: 'Feb 5', days: 1, reason: 'Personal work', status: 'pending', appliedOn: 'Jan 29' },
  { id: '3', employeeName: 'Mike Johnson', type: 'Annual Leave', from: 'Feb 10', to: 'Feb 14', days: 5, reason: 'Family vacation', status: 'approved', appliedOn: 'Jan 25' },
  { id: '4', employeeName: 'Sarah Wilson', type: 'Sick Leave', from: 'Jan 28', to: 'Jan 28', days: 1, reason: 'Not feeling well', status: 'rejected', appliedOn: 'Jan 27' },
  { id: '5', employeeName: 'Tom Brown', type: 'Casual Leave', from: 'Feb 3', to: 'Feb 4', days: 2, reason: 'Home repair work', status: 'pending', appliedOn: 'Jan 30' },
];

const leaveBalance = [
  { type: 'Casual Leave', total: 12, used: 5, remaining: 7 },
  { type: 'Sick Leave', total: 10, used: 2, remaining: 8 },
  { type: 'Annual Leave', total: 15, used: 8, remaining: 7 },
  { type: 'Maternity/Paternity', total: 90, used: 0, remaining: 90 },
];

interface LeaveModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="status-approved">Approved</Badge>;
    case 'pending':
      return <Badge className="status-pending">Pending</Badge>;
    case 'rejected':
      return <Badge className="status-rejected">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const LeaveModule = ({ role }: LeaveModuleProps) => {
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const canApprove = role === 'hr' || role === 'admin';
  const canApply = role === 'employee' || role === 'hr';

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Leave Balance Cards (for employees) */}
        {role === 'employee' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {leaveBalance.map((leave) => (
              <Card key={leave.type} className="glass-card card-hover">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">{leave.type}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">{leave.remaining}</p>
                      <p className="text-xs text-muted-foreground">remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{leave.used}/{leave.total}</p>
                      <p className="text-xs text-muted-foreground">used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats for HR/Admin */}
        {canApprove && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="glass-card card-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {leaveRequests.filter(r => r.status === 'pending').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
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
                    <p className="text-2xl font-bold text-foreground">
                      {leaveRequests.filter(r => r.status === 'approved').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card card-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {leaveRequests.filter(r => r.status === 'rejected').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leave Requests */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  Leave Requests
                </CardTitle>
                <CardDescription>
                  {canApprove ? 'Manage and approve leave requests' : 'Your leave request history'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {canApply && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="glow-button">
                        <Plus className="h-4 w-4 mr-2" />
                        Apply Leave
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card">
                      <DialogHeader>
                        <DialogTitle>Apply for Leave</DialogTitle>
                        <DialogDescription>Fill in the details for your leave request</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Leave Type</Label>
                          <Select>
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casual">Casual Leave</SelectItem>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="annual">Annual Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>From Date</Label>
                            <Input type="date" className="bg-secondary border-border" />
                          </div>
                          <div className="space-y-2">
                            <Label>To Date</Label>
                            <Input type="date" className="bg-secondary border-border" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Reason</Label>
                          <Textarea placeholder="Enter reason for leave" className="bg-secondary border-border" />
                        </div>
                        <Button className="w-full glow-button" onClick={() => setIsDialogOpen(false)}>
                          Submit Request
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
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.type} • {request.days} day{request.days > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.from} - {request.to}
                        </p>
                        <p className="text-xs text-muted-foreground">Applied: {request.appliedOn}</p>
                      </div>
                      {getStatusBadge(request.status)}
                      {canApprove && request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-success hover:text-success hover:bg-success/10">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 pl-14">
                    Reason: {request.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeaveModule;
