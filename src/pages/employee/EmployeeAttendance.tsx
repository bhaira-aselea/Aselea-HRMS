import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  FileText,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleDot,
} from 'lucide-react';

// Mock attendance data for logged-in employee
interface DailyAttendance {
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave' | null;
  checkIn: string | null;
  checkOut: string | null;
  duration: string | null;
  remarks: string | null;
}

const generateMonthAttendance = (year: number, month: number): DailyAttendance[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const attendance: DailyAttendance[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    // Mock data - past dates have attendance
    if (day < 30) {
      const rand = Math.random();
      if (rand > 0.9) {
        attendance.push({
          date: dateStr,
          status: 'absent',
          checkIn: null,
          checkOut: null,
          duration: null,
          remarks: null,
        });
      } else if (rand > 0.8) {
        attendance.push({
          date: dateStr,
          status: 'leave',
          checkIn: null,
          checkOut: null,
          duration: null,
          remarks: 'Sick Leave',
        });
      } else if (rand > 0.7) {
        attendance.push({
          date: dateStr,
          status: 'late',
          checkIn: '10:15 AM',
          checkOut: '06:30 PM',
          duration: '08:15',
          remarks: 'Traffic delay',
        });
      } else {
        attendance.push({
          date: dateStr,
          status: 'present',
          checkIn: '09:00 AM',
          checkOut: '06:00 PM',
          duration: '09:00',
          remarks: null,
        });
      }
    } else if (day === 30) {
      attendance.push({
        date: dateStr,
        status: 'present',
        checkIn: '09:00 AM',
        checkOut: null,
        duration: null,
        remarks: null,
      });
    } else {
      attendance.push({
        date: dateStr,
        status: null,
        checkIn: null,
        checkOut: null,
        duration: null,
        remarks: null,
      });
    }
  }
  
  return attendance;
};

const EmployeeAttendance = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [checkedIn, setCheckedIn] = useState(true); // Mock: Employee already checked in today
  
  const monthAttendance = generateMonthAttendance(selectedYear, selectedMonth);
  
  // Calculate stats for current month
  const stats = {
    present: monthAttendance.filter(d => d.status === 'present').length,
    late: monthAttendance.filter(d => d.status === 'late').length,
    absent: monthAttendance.filter(d => d.status === 'absent').length,
    leave: monthAttendance.filter(d => d.status === 'leave').length,
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  const handleToday = () => {
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };
  
  const getCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days: (DailyAttendance | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 0; i < daysInMonth; i++) {
      days.push(monthAttendance[i]);
    }
    
    return days;
  };
  
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'bg-success/20 border-success/40 text-success';
      case 'late':
        return 'bg-warning/20 border-warning/40 text-warning';
      case 'absent':
        return 'bg-destructive/20 border-destructive/40 text-destructive';
      case 'leave':
        return 'bg-primary/20 border-primary/40 text-primary';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };
  
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'present':
        return <Badge className="status-approved">Present</Badge>;
      case 'late':
        return <Badge className="status-pending">Late</Badge>;
      case 'absent':
        return <Badge className="status-rejected">Absent</Badge>;
      case 'leave':
        return <Badge className="status-in-progress">Leave</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };
  
  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Top Status Banner */}
        <Card className="glass-card border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  checkedIn ? 'bg-success/20' : 'bg-destructive/20'
                }`}>
                  {checkedIn ? (
                    <CheckCircle className="h-8 w-8 text-success" />
                  ) : (
                    <Clock className="h-8 w-8 text-destructive" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {checkedIn ? 'Checked In' : 'Not Checked In'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {checkedIn ? 'Check in time: 09:00 AM • Today' : 'Mark your attendance for today'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className={checkedIn ? 'bg-destructive hover:bg-destructive/90' : 'glow-button'}
                  size="lg"
                  onClick={() => setCheckedIn(!checkedIn)}
                >
                  {checkedIn ? (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Check Out
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="glass-card" onClick={() => navigate('/employee/leave')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Apply Leave
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <CircleDot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.leave}</p>
                  <p className="text-xs text-muted-foreground">Leave</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Card */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Attendance Calendar
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Select 
                    value={selectedMonth.toString()} 
                    onValueChange={(val) => setSelectedMonth(parseInt(val))}
                  >
                    <SelectTrigger className="w-[130px] bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={(val) => setSelectedYear(parseInt(val))}
                  >
                    <SelectTrigger className="w-[100px] bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="secondary" size="sm" onClick={handleToday}>
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="space-y-3">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="h-14" />;
                  }
                  
                  const dayNum = new Date(day.date).getDate();
                  const isTodayDay = isToday(day.date);
                  
                  return (
                    <div
                      key={day.date}
                      className={`
                        h-14 rounded-lg border-2 p-1.5 flex flex-col items-center justify-center
                        transition-all duration-200 hover:scale-105 cursor-pointer
                        ${isTodayDay ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                        ${getStatusColor(day.status)}
                      `}
                    >
                      <span className="text-xs font-semibold">{dayNum}</span>
                      {day.status && (
                        <div className="mt-0.5">
                          {day.status === 'present' && <CheckCircle className="h-2.5 w-2.5" />}
                          {day.status === 'late' && <AlertCircle className="h-2.5 w-2.5" />}
                          {day.status === 'absent' && <XCircle className="h-2.5 w-2.5" />}
                          {day.status === 'leave' && <CircleDot className="h-2.5 w-2.5" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Attendance Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Daily Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Check In</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Check Out</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Duration</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Remarks</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthAttendance.filter(d => d.status !== null).reverse().map((record) => {
                      const date = new Date(record.date);
                      const formattedDate = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      });
                      
                      return (
                        <tr key={record.date} className="border-b border-border hover:bg-secondary/30 transition-colors">
                          <td className="p-4 text-sm text-muted-foreground">{formattedDate}</td>
                          <td className="p-4">{getStatusBadge(record.status)}</td>
                          <td className="p-4 text-sm">
                            {record.checkIn ? (
                              <span className="text-foreground font-medium">{record.checkIn}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 text-sm">
                            {record.checkOut ? (
                              <span className="text-foreground font-medium">{record.checkOut}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-foreground font-medium">
                            {record.duration || '-'}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {record.remarks || '-'}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeAttendance;
