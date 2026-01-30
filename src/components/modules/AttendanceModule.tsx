import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock,
  Calendar,
  MapPin,
  Search,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  punchIn: string;
  punchOut: string;
  totalHours: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  location: string;
}

const attendanceData: AttendanceRecord[] = [
  { id: '1', employeeName: 'John Doe', date: 'Jan 30, 2026', punchIn: '09:00 AM', punchOut: '06:00 PM', totalHours: '9h 0m', status: 'present', location: 'Office' },
  { id: '2', employeeName: 'Jane Smith', date: 'Jan 30, 2026', punchIn: '08:45 AM', punchOut: '05:45 PM', totalHours: '9h 0m', status: 'present', location: 'Office' },
  { id: '3', employeeName: 'Mike Johnson', date: 'Jan 30, 2026', punchIn: '10:15 AM', punchOut: '06:30 PM', totalHours: '8h 15m', status: 'late', location: 'Remote' },
  { id: '4', employeeName: 'Sarah Wilson', date: 'Jan 30, 2026', punchIn: '-', punchOut: '-', totalHours: '-', status: 'absent', location: '-' },
  { id: '5', employeeName: 'Tom Brown', date: 'Jan 30, 2026', punchIn: '09:05 AM', punchOut: '01:00 PM', totalHours: '4h 0m', status: 'half-day', location: 'Office' },
  { id: '6', employeeName: 'Emily Davis', date: 'Jan 30, 2026', punchIn: '08:30 AM', punchOut: '05:30 PM', totalHours: '9h 0m', status: 'present', location: 'Office' },
];

interface AttendanceModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return <Badge className="status-approved">Present</Badge>;
    case 'late':
      return <Badge className="status-pending">Late</Badge>;
    case 'absent':
      return <Badge className="status-rejected">Absent</Badge>;
    case 'half-day':
      return <Badge className="status-in-progress">Half Day</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const AttendanceModule = ({ role }: AttendanceModuleProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    present: attendanceData.filter(r => r.status === 'present').length,
    late: attendanceData.filter(r => r.status === 'late').length,
    absent: attendanceData.filter(r => r.status === 'absent').length,
    halfDay: attendanceData.filter(r => r.status === 'half-day').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.late}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.halfDay}</p>
                  <p className="text-xs text-muted-foreground">Half Day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Attendance Records
                </CardTitle>
                <CardDescription>Today's attendance overview</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[200px] bg-secondary border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Punch In</TableHead>
                    <TableHead>Punch Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id} className="hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {record.employeeName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{record.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.date}</TableCell>
                      <TableCell>{record.punchIn}</TableCell>
                      <TableCell>{record.punchOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {record.location}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceModule;
