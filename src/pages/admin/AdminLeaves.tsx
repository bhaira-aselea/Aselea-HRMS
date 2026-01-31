import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CalendarCheck, Check, X, Building2, UserCircle, Filter } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  role: 'employee' | 'hr';
  company: string;
  department: string;
  leaveType: 'casual' | 'sick' | 'annual' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  avatar?: string;
}

const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP-001',
    role: 'employee',
    company: 'Aselea Technologies',
    department: 'Engineering',
    leaveType: 'casual',
    startDate: '2026-02-10',
    endDate: '2026-02-12',
    days: 3,
    reason: 'Family function',
    status: 'pending',
    appliedOn: '2026-01-28',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: 'EMP-002',
    role: 'employee',
    company: 'Aselea Technologies',
    department: 'Marketing',
    leaveType: 'sick',
    startDate: '2026-02-05',
    endDate: '2026-02-06',
    days: 2,
    reason: 'Medical checkup',
    status: 'approved',
    appliedOn: '2026-01-25',
  },
  {
    id: '3',
    employeeName: 'Sarah Johnson',
    employeeId: 'HR-001',
    role: 'hr',
    company: 'Aselea Technologies',
    department: 'Human Resources',
    leaveType: 'annual',
    startDate: '2026-03-01',
    endDate: '2026-03-07',
    days: 7,
    reason: 'Vacation',
    status: 'pending',
    appliedOn: '2026-01-29',
  },
  {
    id: '4',
    employeeName: 'Mike Johnson',
    employeeId: 'EMP-003',
    role: 'employee',
    company: 'Innovation Corp',
    department: 'Sales',
    leaveType: 'casual',
    startDate: '2026-02-15',
    endDate: '2026-02-16',
    days: 2,
    reason: 'Personal work',
    status: 'rejected',
    appliedOn: '2026-01-27',
  },
  {
    id: '5',
    employeeName: 'Michael Chen',
    employeeId: 'HR-002',
    role: 'hr',
    company: 'Innovation Corp',
    department: 'HR Operations',
    leaveType: 'sick',
    startDate: '2026-02-08',
    endDate: '2026-02-09',
    days: 2,
    reason: 'Flu',
    status: 'approved',
    appliedOn: '2026-01-26',
  },
];

const AdminLeaves = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const filteredRequests = requests.filter(req => {
    const matchesCompany = companyFilter === 'all' || req.company === companyFilter;
    const matchesRole = roleFilter === 'all' || req.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesCompany && matchesRole && matchesStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      casual: 'bg-blue-500/20 text-blue-400',
      sick: 'bg-red-500/20 text-red-400',
      annual: 'bg-purple-500/20 text-purple-400',
      unpaid: 'bg-gray-500/20 text-gray-400',
    };
    return <Badge className={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground">Manage leave requests from all employees and HR managers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-warning" />
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
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="Aselea Technologies">Aselea Technologies</SelectItem>
                  <SelectItem value="Innovation Corp">Innovation Corp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="employee">Employees</SelectItem>
                  <SelectItem value="hr">HR Managers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>All Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{request.employeeName}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">{request.employeeId}</p>
                            <Badge variant="outline" className="text-xs py-0 px-1.5">
                              {request.role === 'hr' ? 'HR' : 'EMP'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {request.company}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{request.department}</TableCell>
                    <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(request.startDate).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          to {new Date(request.endDate).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">{request.days} day{request.days > 1 ? 's' : ''}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-sm line-clamp-2">{request.reason}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(request.appliedOn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      {request.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-success hover:text-success hover:bg-success/10"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No action</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeaves;
