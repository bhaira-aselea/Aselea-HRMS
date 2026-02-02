import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Send,
  Loader2,
  MapPin,
} from 'lucide-react';
import { attendanceAPI } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

interface TodayAttendance {
  _id?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  location?: {
    checkIn?: { latitude: number; longitude: number; address?: string };
    checkOut?: { latitude: number; longitude: number; address?: string };
  };
}

interface DailyAttendance {
  _id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  duration?: number;
  checkIn?: {
    time?: string;
    location?: { latitude: number; longitude: number; address?: string };
  };
  checkOut?: {
    time?: string;
    location?: { latitude: number; longitude: number; address?: string };
  };
}

interface AttendanceEditRequest {
  id: string;
  date: string;
  originalPunchIn: string | null;
  originalPunchOut: string | null;
  requestedPunchIn: string;
  requestedPunchOut: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const EmployeeAttendance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [loading, setLoading] = useState(true);
  const [punchingIn, setPunchingIn] = useState(false);
  const [punchingOut, setPunchingOut] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance | null>(null);
  const [monthAttendance, setMonthAttendance] = useState<DailyAttendance[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DailyAttendance | null>(null);
  const [editFormData, setEditFormData] = useState({
    punchIn: '',
    punchOut: '',
    reason: '',
  });
  
  useEffect(() => {
    fetchTodayAttendance();
    fetchMonthAttendance();
  }, [selectedYear, selectedMonth]);

  const fetchTodayAttendance = async () => {
    try {
      const response = await attendanceAPI.getToday();
      setTodayAttendance(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch today attendance:', error);
      // If no attendance for today, that's okay - user hasn't checked in yet
      if (error.response?.status !== 404) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load today\'s attendance',
          variant: 'destructive',
        });
      }
    }
  };

  const fetchMonthAttendance = async () => {
    try {
      setLoading(true);
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString();
      
      const response = await attendanceAPI.getMyAttendance({ 
        startDate,
        endDate,
      });
      setMonthAttendance(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch attendance:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load attendance records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handlePunchIn = async () => {
    try {
      setPunchingIn(true);
      let location;
      
      try {
        location = await getLocation();
        toast({
          title: 'Location captured',
          description: 'Your check-in location has been recorded',
        });
      } catch (error) {
        console.error('Location error:', error);
        toast({
          title: 'Warning',
          description: 'Could not get location, proceeding without it',
          variant: 'destructive',
        });
      }

      await attendanceAPI.checkIn(location);
      toast({
        title: 'Success',
        description: 'Checked in successfully!',
      });
      fetchTodayAttendance();
      fetchMonthAttendance();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to check in',
        variant: 'destructive',
      });
    } finally {
      setPunchingIn(false);
    }
  };

  const handlePunchOut = async () => {
    try {
      setPunchingOut(true);
      await attendanceAPI.checkOut();
      toast({
        title: 'Success',
        description: 'Checked out successfully!',
      });
      fetchTodayAttendance();
      fetchMonthAttendance();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to check out',
        variant: 'destructive',
      });
    } finally {
      setPunchingOut(false);
    }
  };
  
  // Calculate stats for current month
  const stats = {
    present: monthAttendance.filter(d => d.status === 'present').length,
    late: monthAttendance.filter(d => d.status === 'late').length,
    absent: monthAttendance.filter(d => d.status === 'absent').length,
    leave: monthAttendance.filter(d => d.status === 'on-leave').length,
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
    const days: Array<{ day: number; attendance: DailyAttendance | null }> = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, attendance: null });
    }
    
    // Add actual days with attendance records matched by date
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(selectedYear, selectedMonth, day).toISOString().split('T')[0];
      const attendanceRecord = monthAttendance.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === dateStr;
      });
      days.push({ day, attendance: attendanceRecord || null });
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
      case 'on-leave':
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
      case 'on-leave':
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

  const openEditDialog = (record: DailyAttendance) => {
    setSelectedRecord(record);
    const checkInTime = record.checkInTime ? new Date(record.checkInTime) : null;
    const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null;
    
    setEditFormData({
      punchIn: checkInTime ? `${String(checkInTime.getHours()).padStart(2, '0')}:${String(checkInTime.getMinutes()).padStart(2, '0')}` : '',
      punchOut: checkOutTime ? `${String(checkOutTime.getHours()).padStart(2, '0')}:${String(checkOutTime.getMinutes()).padStart(2, '0')}` : '',
      reason: '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmitEditRequest = () => {
    // Here you would send the edit request to the backend
    console.log('Submitting edit request:', {
      date: selectedRecord?.date,
      originalPunchIn: selectedRecord?.checkInTime,
      originalPunchOut: selectedRecord?.checkOutTime,
      requestedPunchIn: editFormData.punchIn,
      requestedPunchOut: editFormData.punchOut,
      reason: editFormData.reason,
    });
    
    // Show success message
    alert('Attendance edit request submitted successfully! HR will review your request.');
    
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
    setEditFormData({ punchIn: '', punchOut: '', reason: '' });
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
                  todayAttendance?.checkInTime ? 'bg-success/20' : 'bg-destructive/20'
                }`}>
                  {todayAttendance?.checkInTime ? (
                    <CheckCircle className="h-8 w-8 text-success" />
                  ) : (
                    <Clock className="h-8 w-8 text-destructive" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {todayAttendance?.checkInTime ? 'Checked In' : 'Not Checked In'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {todayAttendance?.checkInTime 
                      ? `Check in time: ${new Date(todayAttendance.checkInTime).toLocaleTimeString()} • Today` 
                      : 'Mark your attendance for today'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className={todayAttendance?.checkInTime && !todayAttendance?.checkOutTime ? 'bg-destructive hover:bg-destructive/90' : 'glow-button'}
                  size="lg"
                  onClick={todayAttendance?.checkInTime && !todayAttendance?.checkOutTime ? handlePunchOut : handlePunchIn}
                  disabled={todayAttendance?.checkOutTime !== undefined}
                >
                  {todayAttendance?.checkInTime && !todayAttendance?.checkOutTime ? (
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
                {getCalendarDays().map((dayData, idx) => {
                  if (dayData.day === 0) {
                    return <div key={`empty-${idx}`} className="h-14" />;
                  }
                  
                  const currentDate = new Date(selectedYear, selectedMonth, dayData.day);
                  const isTodayDay = isToday(currentDate.toISOString());
                  const attendance = dayData.attendance;
                  
                  return (
                    <div
                      key={`day-${dayData.day}`}
                      className={`
                        h-14 rounded-lg border-2 p-1.5 flex flex-col items-center justify-center
                        transition-all duration-200 hover:scale-105 cursor-pointer
                        ${isTodayDay ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                        ${getStatusColor(attendance?.status || null)}
                      `}
                    >
                      <span className="text-xs font-semibold">{dayData.day}</span>
                      {attendance?.status && (
                        <div className="mt-0.5">
                          {attendance.status === 'present' && <CheckCircle className="h-2.5 w-2.5" />}
                          {attendance.status === 'late' && <AlertCircle className="h-2.5 w-2.5" />}
                          {attendance.status === 'absent' && <XCircle className="h-2.5 w-2.5" />}
                          {attendance.status === 'on-leave' && <CircleDot className="h-2.5 w-2.5" />}
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
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Location</th>
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
                            {record.checkInTime ? (
                              <span className="text-foreground font-medium">
                                {new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 text-sm">
                            {record.checkOutTime ? (
                              <span className="text-foreground font-medium">
                                {new Date(record.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-foreground font-medium">
                            {record.duration ? `${Math.floor(record.duration / 60)}h ${record.duration % 60}m` : '-'}
                          </td>
                          <td className="p-4 text-sm">
                            {record.checkIn?.location ? (
                              <a
                                href={`https://www.google.com/maps?q=${record.checkIn.location.latitude},${record.checkIn.location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                title="View check-in location on Google Maps"
                              >
                                <MapPin className="h-4 w-4" />
                                <span className="underline">View</span>
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {record.status === 'present' || record.status === 'late' ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(record)}
                                title="Request attendance edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
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

        {/* Edit Attendance Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Attendance Edit</DialogTitle>
              <DialogDescription>
                Submit a request to edit your check in/out times for{' '}
                {selectedRecord && new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Original Times */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-foreground">Current Record:</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Check In: </span>
                    <span className="text-foreground font-medium">
                      {selectedRecord?.checkInTime ? new Date(selectedRecord.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Not recorded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Check Out: </span>
                    <span className="text-foreground font-medium">
                      {selectedRecord?.checkOutTime ? new Date(selectedRecord.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Not recorded'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requested Times */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="punchIn">Corrected Check In Time</Label>
                  <Input
                    id="punchIn"
                    type="time"
                    className="bg-secondary border-border"
                    value={editFormData.punchIn}
                    onChange={(e) => setEditFormData({ ...editFormData, punchIn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="punchOut">Corrected Check Out Time</Label>
                  <Input
                    id="punchOut"
                    type="time"
                    className="bg-secondary border-border"
                    value={editFormData.punchOut}
                    onChange={(e) => setEditFormData({ ...editFormData, punchOut: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Edit Request <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why you need to edit this attendance record (e.g., forgot to check in/out, system error, etc.)"
                    className="bg-secondary border-border min-h-[100px]"
                    value={editFormData.reason}
                    onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="glow-button"
                onClick={handleSubmitEditRequest}
                disabled={!editFormData.reason || !editFormData.punchIn || !editFormData.punchOut}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeAttendance;
