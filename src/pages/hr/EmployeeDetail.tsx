import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  UserCircle,
  Key,
  Clock,
  MessageSquare,
  ClipboardList,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileEdit,
} from 'lucide-react';

// Section type for navigation
type Section = 'overview' | 'attendance' | 'tasks' | 'chat';

// Employee interface matching HREmployees.tsx
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  employeeId: string;
  password: string;
  dateOfBirth: string;
  address: string;
  profilePhoto?: string;
  reportingTo?: string;
}

// Attendance interfaces
interface DailyAttendance {
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  punchIn: string | null;
  punchOut: string | null;
  duration: string | null;
  remarks: string | null;
}

interface AttendanceEditRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  originalPunchIn: string | null;
  originalPunchOut: string | null;
  requestedPunchIn: string;
  requestedPunchOut: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Mock data - matches HREmployees.tsx
const employees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', phone: '+1 (555) 123-4567', department: 'Engineering', position: 'Senior Developer', joinDate: '2022-03-15', status: 'active', employeeId: 'EMP-001', password: 'pass123', dateOfBirth: '1990-05-15', address: '123 Main St, City, State 12345' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', phone: '+1 (555) 234-5678', department: 'Marketing', position: 'Marketing Manager', joinDate: '2021-06-20', status: 'active', employeeId: 'EMP-002', password: 'welcome456', dateOfBirth: '1988-08-22', address: '456 Oak Ave, City, State 23456' },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@company.com', phone: '+1 (555) 345-6789', department: 'Sales', position: 'Sales Executive', joinDate: '2023-01-10', status: 'on-leave', employeeId: 'EMP-003', password: 'mike2023', dateOfBirth: '1992-03-10', address: '789 Pine Rd, City, State 34567' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.w@company.com', phone: '+1 (555) 456-7890', department: 'HR', position: 'HR Specialist', joinDate: '2020-09-05', status: 'active', employeeId: 'EMP-004', password: 'sarah789', dateOfBirth: '1991-11-30', address: '321 Elm St, City, State 45678' },
  { id: '5', name: 'Tom Brown', email: 'tom.brown@company.com', phone: '+1 (555) 567-8901', department: 'Engineering', position: 'Frontend Developer', joinDate: '2023-02-14', status: 'active', employeeId: 'EMP-005', password: 'tom2024', dateOfBirth: '1993-07-18', address: '654 Maple Dr, City, State 56789' },
  { id: '6', name: 'Emily Davis', email: 'emily.d@company.com', phone: '+1 (555) 678-9012', department: 'Finance', position: 'Accountant', joinDate: '2022-11-20', status: 'active', employeeId: 'EMP-006', password: 'emily321', dateOfBirth: '1989-12-05', address: '987 Cedar Ln, City, State 67890' },
];

// Mock attendance data
const mockAttendance: Record<string, DailyAttendance[]> = {
  '1': [
    { date: '2026-01-29', status: 'present', punchIn: '09:00 AM', punchOut: '06:00 PM', duration: '09:00', remarks: null },
    { date: '2026-01-28', status: 'present', punchIn: '09:00 AM', punchOut: '06:00 PM', duration: '09:00', remarks: null },
    { date: '2026-01-27', status: 'present', punchIn: '09:00 AM', punchOut: '06:00 PM', duration: '09:00', remarks: null },
    { date: '2026-01-26', status: 'present', punchIn: '09:00 AM', punchOut: '06:00 PM', duration: '09:00', remarks: null },
    { date: '2026-01-25', status: 'present', punchIn: '09:00 AM', punchOut: '06:00 PM', duration: '09:00', remarks: null },
    { date: '2026-01-24', status: 'absent', punchIn: null, punchOut: null, duration: null, remarks: null },
  ],
};

// Mock edit requests
const mockEditRequests: AttendanceEditRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    date: '2026-01-27',
    originalPunchIn: '09:00 AM',
    originalPunchOut: '06:00 PM',
    requestedPunchIn: '09:15 AM',
    requestedPunchOut: '06:30 PM',
    reason: 'Forgot to punch in on time due to system issue. Actually arrived at 9:15 AM and left at 6:30 PM.',
    status: 'pending',
    submittedAt: '2026-01-28T10:30:00',
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'John Doe',
    date: '2026-01-25',
    originalPunchIn: '09:00 AM',
    originalPunchOut: null,
    requestedPunchIn: '09:00 AM',
    requestedPunchOut: '07:00 PM',
    reason: 'Forgot to punch out. Was working late on urgent project.',
    status: 'pending',
    submittedAt: '2026-01-26T09:00:00',
  },
];

const EmployeeDetail = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [editRequests, setEditRequests] = useState<AttendanceEditRequest[]>(mockEditRequests);
  const [selectedRequest, setSelectedRequest] = useState<AttendanceEditRequest | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  // Find employee by ID
  const employee = employees.find(emp => emp.id === employeeId);
  
  // Get employee attendance
  const employeeAttendance = mockAttendance[employeeId || ''] || [];
  
  // Get pending edit requests for this employee
  const pendingRequests = editRequests.filter(
    req => req.employeeId === employeeId && req.status === 'pending'
  );

  // If employee not found, show error state
  if (!employee) {
    return (
      <DashboardLayout>
        <div className="space-y-6 fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/hr/employees')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </div>
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <UserCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
              <p className="text-muted-foreground">The employee you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Helper function for status styling
  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-approved';
      case 'on-leave':
        return 'status-pending';
      case 'inactive':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  // Helper function for status display text
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const handleApproveRequest = (requestId: string) => {
    setEditRequests(editRequests.map(req =>
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    alert('Attendance edit request approved! Employee attendance has been updated.');
    setIsRequestDialogOpen(false);
  };

  const handleRejectRequest = (requestId: string) => {
    setEditRequests(editRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
    alert('Attendance edit request rejected. Original data will remain unchanged.');
    setIsRequestDialogOpen(false);
  };

  const viewRequestDetails = (request: AttendanceEditRequest) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/hr/employees')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Profile</h1>
              <p className="text-muted-foreground">Complete employee information and details</p>
            </div>
          </div>
          <Button className="glow-button">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile Card and Navigation Menu */}
          <div className="lg:col-span-3 space-y-4">
            {/* Profile Card */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-28 w-28 mb-4 border-4 border-primary/20 ring-2 ring-primary/10">
                    <AvatarImage src={employee.profilePhoto} alt={employee.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-semibold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-foreground mb-1">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{employee.position}</p>
                  <div className="flex flex-col gap-2 w-full">
                    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-xs justify-center">
                      {employee.department}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusClassName(employee.status)} text-xs justify-center`}>
                      {getStatusText(employee.status)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs justify-center">
                      {employee.employeeId}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="glass-card">
              <CardContent className="p-3">
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'overview'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('overview')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Overview
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'attendance'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('attendance')}
                  >
                    <Clock className="h-4 w-4 mr-3" />
                    Attendance
                    {pendingRequests.length > 0 && (
                      <Badge className="ml-auto bg-destructive text-xs">
                        {pendingRequests.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'tasks'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('tasks')}
                  >
                    <ClipboardList className="h-4 w-4 mr-3" />
                    Tasks
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'chat'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('chat')}
                  >
                    <MessageSquare className="h-4 w-4 mr-3" />
                    Chat
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Dynamic Content Area */}
          <div className="lg:col-span-9">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Information Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="text-sm">Full Name</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{employee.name}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Email Address</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right break-all">{employee.email}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">Phone Number</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{employee.phone}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Date of Birth</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">
                          {employee.dateOfBirth || 'Not provided'}
                        </span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">Address</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right max-w-xs">
                          {employee.address || 'Not provided'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Employment Information */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Employment Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <UserCircle className="h-4 w-4" />
                          <span className="text-sm">Employee ID</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right font-mono">
                          {employee.employeeId}
                        </span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">Department</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{employee.department}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">Position</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{employee.position}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Join Date</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{employee.joinDate}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="text-sm">Reporting To</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">
                          {employee.reportingTo || 'Not assigned'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Login Credentials Card */}
                <Card className="glass-card border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Login Credentials</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Employee access credentials for the system
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <UserCircle className="h-4 w-4" />
                          <span className="text-sm">Username</span>
                        </div>
                        <div className="bg-muted/50 px-4 py-3 rounded-lg font-mono text-sm font-medium">
                          {employee.employeeId}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Key className="h-4 w-4" />
                          <span className="text-sm">Password</span>
                        </div>
                        <div className="bg-muted/50 px-4 py-3 rounded-lg font-mono text-sm font-medium">
                          {employee.password || 'employee123'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'attendance' && (
              <div className="space-y-6">
                {/* Pending Edit Requests */}
                {pendingRequests.length > 0 && (
                  <Card className="glass-card border-warning/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-warning/10">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">Pending Edit Requests</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pendingRequests.length} attendance edit request{pendingRequests.length > 1 ? 's' : ''} awaiting your review
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pendingRequests.map((request) => (
                          <Card key={request.id} className="glass-card border-warning/20">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <FileEdit className="h-4 w-4 text-warning" />
                                    <span className="font-semibold text-foreground">
                                      {new Date(request.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                    <Badge className="status-pending text-xs">Pending</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Original Punch In:</p>
                                      <p className="font-medium text-foreground">{request.originalPunchIn || 'Not recorded'}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Requested Punch In:</p>
                                      <p className="font-medium text-success">{request.requestedPunchIn}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Original Punch Out:</p>
                                      <p className="font-medium text-foreground">{request.originalPunchOut || 'Not recorded'}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Requested Punch Out:</p>
                                      <p className="font-medium text-success">{request.requestedPunchOut}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground text-xs">Reason:</p>
                                    <p className="text-sm text-foreground mt-1">{request.reason}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-success hover:bg-success/90"
                                    onClick={() => handleApproveRequest(request.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive border-destructive/30"
                                    onClick={() => handleRejectRequest(request.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attendance Records */}
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Attendance Records</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {employeeAttendance.length > 0 ? (
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-secondary/50 border-b border-border">
                              <th className="text-left p-4 text-sm font-semibold text-foreground">Date</th>
                              <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                              <th className="text-left p-4 text-sm font-semibold text-foreground">Punch In</th>
                              <th className="text-left p-4 text-sm font-semibold text-foreground">Punch Out</th>
                              <th className="text-left p-4 text-sm font-semibold text-foreground">Duration</th>
                              <th className="text-left p-4 text-sm font-semibold text-foreground">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeAttendance.map((record) => (
                              <tr key={record.date} className="border-b border-border hover:bg-secondary/30 transition-colors">
                                <td className="p-4 text-sm text-muted-foreground">
                                  {new Date(record.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="p-4">
                                  <Badge className={
                                    record.status === 'present' ? 'status-approved' :
                                    record.status === 'late' ? 'status-pending' :
                                    record.status === 'absent' ? 'status-rejected' :
                                    'status-in-progress'
                                  }>
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm">
                                  <span className="text-foreground font-medium">{record.punchIn || '-'}</span>
                                </td>
                                <td className="p-4 text-sm">
                                  <span className="text-foreground font-medium">{record.punchOut || '-'}</span>
                                </td>
                                <td className="p-4 text-sm text-foreground font-medium">
                                  {record.duration || '-'}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {record.remarks || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Attendance Records</h3>
                        <p className="text-muted-foreground">
                          No attendance records found for {employee.name}.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'tasks' && (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Assigned Tasks</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-12 text-center">
                  <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Tasks Module</h3>
                  <p className="text-muted-foreground">
                    Task management and assignments for {employee.name} will be displayed here.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === 'chat' && (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Chat with {employee.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Chat Module</h3>
                  <p className="text-muted-foreground">
                    Direct messaging interface with {employee.name} will be displayed here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetail;
